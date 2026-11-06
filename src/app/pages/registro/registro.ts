import { Component, inject, signal } from '@angular/core';
import { SesionService } from '../../services/sesion.service';
import { Router, RouterLink } from '@angular/router';
import { UsuarioRegistro } from '../../models/usuario-model';
import { email, form, FormField, required } from '@angular/forms/signals';
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

  readonly error = signal<string>('')

  private readonly model = signal<UsuarioRegistro>({ username: '', password: '' , email: ''})

  readonly registroForm = form(this.model, (ruta) => {
    required(ruta.username, {message: 'El usuario es obligatorio'})
    required(ruta.password, {message: 'La contraseña es obligatorio'})
    required(ruta.email, {message: 'El mail es obligatorio'})
    email(ruta.email, {message: 'Formato invalido de mail'})
  })

  enviar(event:Event){
    event.preventDefault()
    this.sesion.registrar(this.model()).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (e) => this.error.set(e.error.message)
    })
  }
}
