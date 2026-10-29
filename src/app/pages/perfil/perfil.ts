import { Component, signal } from '@angular/core';
import { form, required, minLength, maxLength, email, pattern, FormField } from '@angular/forms/signals';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';

@Component({
  selector: 'app-perfil',
  imports: [FormField, MensajeError],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  // 1. Los datos del formulario
  // TODO SCRUM-18: cargar username y email desde sesion.usuario()
  readonly model = signal({ username: 'Aníbal', email: 'anibal@ejemplo.com', password: '' });

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

  guardar(event: Event) {
    event.preventDefault(); // evita que el navegador recargue la página
    if (this.formPerfil().invalid()) return;

    // TODO SCRUM-17/18: PUT /usuarios/{id} con { username, email, password: password || null }
    console.log('Perfil a guardar (mock):', this.model());
    this.mensajeGuardado.set('Cambios guardados.');

    // La contraseña no se deja escrita después de guardar
    this.model.update((m) => ({ ...m, password: '' }));
  }
}