import { Component, inject, signal } from '@angular/core';
import { form, required, minLength, maxLength, email, pattern, FormField } from '@angular/forms/signals';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';
import { SesionService } from '../../services/sesion.service';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-perfil',
  imports: [FormField, MensajeError],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private readonly sesion = inject(SesionService);
  private readonly usuarioService = inject(UsuarioService);

  // El authGuard ya garantiza que hay sesión, por eso el "!"
  private readonly usuario = this.sesion.usuario()!;
  // Entró con Google: el email es su "llave" (el back lo busca por email) y no tiene contraseña propia
  readonly esGoogle = this.usuario.proveedor === 'GOOGLE';

  // 1. Los datos del formulario: arrancan con los del usuario logueado
  readonly model = signal({ username: this.usuario.username, email: this.usuario.email, password: '' });

  // 2. Las reglas (las mismas que pide el back en el registro)
  readonly formPerfil = form(this.model, (campo) => {
    required(campo.username, { message: 'Ingresa tu nombre de usuario.' });
    minLength(campo.username, 3, { message: 'Debe tener entre 3 y 30 caracteres.' });
    maxLength(campo.username, 30, { message: 'Debe tener entre 3 y 30 caracteres.' });

    required(campo.email, { message: 'Ingresa tu email.' });
    email(campo.email, { message: 'El email no es válido.' });

    // Opcional: vacía = no se cambia; si se escribe, mínimo 6 caracteres
    pattern(campo.password, /^$|^.{6,}$/, { message: 'Debe tener al menos 6 caracteres.' });
  });

  readonly mensajeGuardado = signal('');
  readonly error = signal('');
  readonly guardando = signal(false);

  guardar(event: Event) {
    event.preventDefault(); // evita que el navegador recargue la página
    if (this.formPerfil().invalid()) return;

    this.mensajeGuardado.set('');
    this.error.set('');
    this.guardando.set(true);

    // Contraseña vacía = el back no la cambia
    this.usuarioService.actualizarPerfil(this.usuario.id, this.model()).subscribe({
      next: (actualizado) => {
        this.guardando.set(false);

        // El token quedó a nombre del usuario viejo: hay que volver a entrar
        if (actualizado.username !== this.usuario.username) {
          this.sesion.cerrarSesion();
          return;
        }

        this.sesion.actualizarUsuario({ email: actualizado.email });
        this.mensajeGuardado.set('Cambios guardados.');
        this.model.update((m) => ({ ...m, password: '' })); // la contraseña no queda escrita
      },
      error: (e) => {
        this.guardando.set(false);
        // Ej.: 409 "El username ya esta registrado" o "El email ya esta registrado"
        this.error.set(e.error?.message ?? 'No se pudieron guardar los cambios. Probá de nuevo.');
      },
    });
  }
}