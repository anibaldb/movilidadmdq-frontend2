import { Component, computed, effect, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { form, required, FormField } from '@angular/forms/signals';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';
import { UsuarioService } from '../../services/usuario-service';
import { SesionService } from '../../services/sesion.service';
import { BloqueoService } from '../../services/bloqueo-service';

@Component({
  selector: 'app-admin-usuarios',
  imports: [FormField, MensajeError],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css',
})
export class AdminUsuarios {
  private readonly usuarioService = inject(UsuarioService);
  private readonly sesion = inject(SesionService);
  private readonly bloqueos = inject(BloqueoService)

  // 1. El formulario de búsqueda
  readonly model = signal({ query: '' });

  readonly formBusqueda = form(this.model, (campo) => {
    required(campo.query, { message: 'Ingresa un username o email.' });
  });

  // 2. Lo que se buscó: al cambiar, el httpResource hace GET /usuarios/buscar?query=
  readonly busqueda = signal('');
  readonly usuario = this.usuarioService.obtenerUsuario(() => this.busqueda());

  // El back responde 404 cuando no existe nadie con ese username o email
  readonly noEncontrado = computed(
    () => (this.usuario.error() as HttpErrorResponse | undefined)?.status === 404,
  );

  // El admin no puede eliminarse a sí mismo desde acá
  readonly esUsuarioActual = computed(
    () => this.usuario.value()?.id === this.sesion.usuario()?.id,
  );

  readonly bloqueado = computed(() => {
    const id = this.usuario.value()?.id
    return id === undefined ? false : (this.bloqueos.estaBloqueado(id) ?? false)
  })
  readonly cambiandoBloqueo = signal(false)

  // 3. Estado de la eliminación
  // Confirmación en la página: qué acción espera el "Sí" del admin (null = ninguna)
  readonly confirmando = signal<'bloquear' | 'desbloquear' | 'eliminar' | null>(null)
  readonly eliminando = signal(false);
  readonly mensaje = signal('');
  readonly errorAccion = signal('');

  constructor() {
    effect(() => {
      const encontrado = this.usuario.hasValue() ? this.usuario.value() : undefined
      if (encontrado && encontrado.bloqueado !== undefined) {
        this.bloqueos.fijar(encontrado.id, encontrado.bloqueado)
      }
    })
  }

  buscar(event: Event) {
    event.preventDefault(); // evita que el navegador recargue la página
    if (this.formBusqueda().invalid()) return;

    this.mensaje.set('');
    this.errorAccion.set('');
    this.confirmando.set(null);

    const texto = this.model().query.trim();
    if (texto === this.busqueda()) {
      this.usuario.reload(); // misma búsqueda: se vuelve a pedir
    } else {
      this.busqueda.set(texto);
    }
  }

  pedirBloqueo() {
    this.mensaje.set('')
    this.errorAccion.set('')
    this.confirmando.set(this.bloqueado() ? 'desbloquear' : 'bloquear')
  }

  confirmarBloqueo() {
    const encontrado = this.usuario.value()
    const accion = this.confirmando()
    if (!encontrado || (accion !== 'bloquear' && accion !== 'desbloquear')) return

    const bloquear = accion === 'bloquear'
    this.errorAccion.set('')
    this.cambiandoBloqueo.set(true)

    this.bloqueos.cambiar(encontrado.id, bloquear).subscribe({
      next: () => {
        this.cambiandoBloqueo.set(false)
        this.confirmando.set(null)
        this.mensaje.set(
          bloquear
            ? `Se bloqueó a ${encontrado.username}. Ya no puede crear foros ni comentar.`
            : `Se desbloqueó a ${encontrado.username}. Ya puede crear foros y comentar.`
        )
      },
      error: (e) => {
        this.cambiandoBloqueo.set(false)
        this.errorAccion.set(
          e.error?.message ?? `No se pudo ${bloquear ? 'bloquear' : 'desbloquear'} al usuario. Probá de nuevo.`
        )
      }
    })
  }

  eliminar() {
    const encontrado = this.usuario.value();
    if (!encontrado) return;

    this.errorAccion.set('');
    this.eliminando.set(true);

    // DELETE /usuarios/{id}
    this.usuarioService.eliminarUsuario(encontrado.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.confirmando.set(null);
        this.mensaje.set(`Se eliminó la cuenta de ${encontrado.username}.`);
        this.busqueda.set(''); // limpia el resultado
        this.model.set({ query: '' });
      },
      error: (e) => {
        this.eliminando.set(false);
        this.errorAccion.set(e.error?.message ?? 'No se pudo eliminar el usuario. Probá de nuevo.');
      },
    });
  }
}