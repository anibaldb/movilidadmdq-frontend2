import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { form, required, FormField } from '@angular/forms/signals';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';
import { UsuarioService } from '../../services/usuario-service';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-admin-usuarios',
  imports: [FormField, MensajeError],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.css',
})
export class AdminUsuarios {
  private readonly usuarioService = inject(UsuarioService);
  private readonly sesion = inject(SesionService);

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

  // 3. Estado de la eliminación
  readonly confirmando = signal(false);
  readonly eliminando = signal(false);
  readonly mensaje = signal('');
  readonly errorAccion = signal('');

  buscar(event: Event) {
    event.preventDefault(); // evita que el navegador recargue la página
    if (this.formBusqueda().invalid()) return;

    this.mensaje.set('');
    this.errorAccion.set('');
    this.confirmando.set(false);

    const texto = this.model().query.trim();
    if (texto === this.busqueda()) {
      this.usuario.reload(); // misma búsqueda: se vuelve a pedir
    } else {
      this.busqueda.set(texto);
    }
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
        this.confirmando.set(false);
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
