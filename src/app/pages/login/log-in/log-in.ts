import { Component, inject, signal } from '@angular/core';
import { SesionService } from '../../../services/sesion.service';
import { Router } from '@angular/router';
import { UsuarioLogin } from '../../../models/usuario-model';
import { form, FormField, required } from '@angular/forms/signals';
import { MensajeError } from '../../../components/mensaje-error/mensaje-error';

@Component({
  imports: [FormField, MensajeError],
  selector: 'app-log-in',
  styleUrl: './log-in.css',
  templateUrl: './log-in.html',
})
export class LogIn {
  private readonly sesion = inject(SesionService)
  private readonly router = inject(Router)

  readonly showPassword = signal(false)

  readonly error = signal<string>('')

  private readonly model = signal<UsuarioLogin>({ username: '', password: '' })

  readonly loginForm = form(this.model, (ruta) => {
    required(ruta.username, {message: 'El usuario es obligatorio'})
    required(ruta.password, {message: 'La contraseña es obligatorio'})
  })

  enviar(event:Event){
    event.preventDefault()
    this.sesion.login(this.model()).subscribe({
      next: () => this.router.navigate(['/calcular']),
      error: (e) => this.error.set(e.error.message)
    })
  }
}
