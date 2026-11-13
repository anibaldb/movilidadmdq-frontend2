import { Component, inject, signal } from '@angular/core';
import { SesionService } from '../../services/sesion.service';
import { Router, RouterLink } from '@angular/router';
import { UsuarioRegistro } from '../../models/usuario-model';
import { email, form, FormField, maxLength, minLength,pattern,  required, validate } from '@angular/forms/signals';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';

@Component({
  imports: [FormField, MensajeError, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  private readonly sesion = inject(SesionService)
  private readonly router = inject(Router)

  readonly showPassword = signal(false)
  readonly showConfirmar = signal(false)

  readonly error = signal<string>('')

  private readonly model = signal<UsuarioRegistro & {confirmarPassword:string}>({ username: '', password: '' , email: '', confirmarPassword: ''})

  readonly registroForm = form(this.model, (ruta) => {
    required(ruta.username, {message: 'El usuario es obligatorio'})
    pattern(ruta.username, /\S/, {message: 'El usuario es obligatorio'})
    minLength(ruta.username, 3, { message: 'El usuario debe tener entre 3 y 30 caracteres'})
    maxLength(ruta.username, 30, { message: 'El usuario debe tener entre 3 y 30 caracteres'})
    required(ruta.password, {message: 'La contraseña es obligatoria'})
    minLength(ruta.password,6,{message:'La contraseña debe tener al menos 6 caracteres'})
    required(ruta.email, {message: 'El mail es obligatorio'})
    email(ruta.email, {message: 'Formato invalido de mail'})
    required(ruta.confirmarPassword, {message: 'Repetí la contraseña'})
    validate(ruta.confirmarPassword, ({value, valueOf}) => 
      value() !== '' && value() !==(valueOf(ruta.password))
        ? {kind: 'passwordMismatch', message:'Las contraseñas no coinciden'}
        :null
    )
  })

  enviar(event:Event){
    event.preventDefault()
    const m = this.model()
    if (this.registroForm().invalid()) return
    this.sesion.registrar({username: m.username, password: m.password, email: m.email}).subscribe({
      // Al login con aviso de éxito y el usuario ya escrito
      next: () => this.router.navigate(['/login'], { queryParams: { registrado: 1, usuario: m.username } }),
      // 400: el detalle viene en "errores"; 409 (ya existe): en "message"
      error: (e) => this.error.set(e.error?.errores?.[0] ?? e.error?.message ?? 'No se pudo crear la cuenta. Probá de nuevo.')
    })
  }
}
