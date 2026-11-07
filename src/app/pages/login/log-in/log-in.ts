import { Component, inject, signal } from '@angular/core';
import { SesionService } from '../../../services/sesion.service';

import { UsuarioLogin } from '../../../models/usuario-model';
import { form, FormField, required } from '@angular/forms/signals';
import { MensajeError } from '../../../components/mensaje-error/mensaje-error';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  imports: [FormField, MensajeError, RouterLink],
  selector: 'app-log-in',
  styleUrl: './log-in.css',
  templateUrl: './log-in.html',
})
export class LogIn {
  private readonly sesion = inject(SesionService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

  readonly showPassword = signal(false)

  readonly error = signal<string>('')

  private readonly model = signal<UsuarioLogin>({ username: '', password: '' })

  readonly loginForm = form(this.model, (ruta) => {
    required(ruta.username, {message: 'El usuario es obligatorio'})
    required(ruta.password, {message: 'La contraseña es obligatorio'})
  })

    enviar(event: Event) {
    event.preventDefault()
    if (this.loginForm().invalid()) return

    this.sesion.login(this.model()).subscribe({
      next: () => {
        // Vuelve a la página que pidió antes del login (la manda el authGuard en ?returnUrl=)
        const volverA = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/calcular'
        this.router.navigateByUrl(volverA)
      },
      error: (e) => this.error.set(e.error?.message ?? 'No se pudo iniciar sesión. Probá de nuevo.')
    })
  }
}
