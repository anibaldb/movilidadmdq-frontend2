import { inject, Service, signal, untracked } from '@angular/core';
import { tap } from 'rxjs';
import { UsuarioService } from './usuario-service';

// Estado de bloqueo compartido: id de usuario -> ¿está bloqueado?
// Todas las pantallas (foros, foro-detalle, admin-usuarios) leen de acá,
// así que al bloquear/desbloquear a alguien se actualiza en todos lados a la vez.
@Service()
export class BloqueoService {
    private readonly usuarioService = inject(UsuarioService);
    private readonly estados = signal<Record<number, boolean>>({});

    // Se lee dentro de computed/plantillas: se recalcula solo cuando cambia ese usuario.
    // undefined = todavía no se sabe
    estaBloqueado(id: number): boolean | undefined {
        return this.estados()[id];
    }

    // Guarda lo que informa el back (autor de un foro, resultado de una búsqueda, etc.)
    fijar(id: number, bloqueado: boolean) {
        // untracked: fijar se llama desde effects, y no deben quedar suscriptos a este mapa
        // (si no, al bloquear el effect se re-ejecutaría y volvería a poner el valor viejo del back)
        if (untracked(this.estados)[id] === bloqueado) return;
        this.estados.update((estados) => ({ ...estados, [id]: bloqueado }));
    }

    // Ids ya pedidos al back: cada autor se consulta una sola vez
    private readonly pedidos = new Set<number>();

    // Averigua si un autor está bloqueado buscándolo por username (/usuarios/buscar no acepta id).
    // Si falla no pasa nada: queda como "no se sabe" y se muestra como no bloqueado.
    cargar(id: number, username: string) {
        if (untracked(this.estados)[id] !== undefined || this.pedidos.has(id)) return;
        this.pedidos.add(id);
        this.usuarioService.consultarBloqueo(username).subscribe({
            next: (u) => this.fijar(id, !!u.bloqueado),
            error: () => this.pedidos.delete(id),
        });
    }

    // Llama al back y, si salió bien, actualiza el estado compartido
    cambiar(id: number, bloqueado: boolean) {
        return this.usuarioService.bloquearUsuario(id, bloqueado).pipe(
            tap(() => this.fijar(id, bloqueado)),
        );
    }
}