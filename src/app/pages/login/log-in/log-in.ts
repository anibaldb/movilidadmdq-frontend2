import { Component, inject, signal } from '@angular/core';
import { SesionService } from '../../../services/sesion.service';
import { environment } from '../../../../environments/environment';
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

  // El back o la pantalla de Google vuelven con ?error=... si el login con Google falló
  readonly errorGoogle = this.route.snapshot.queryParamMap.has('error')

  // Viene de crear la cuenta: /login?registrado=1&usuario=...
  readonly registrado = this.route.snapshot.queryParamMap.has('registrado')

  private readonly model = signal<UsuarioLogin>({
    username: this.route.snapshot.queryParamMap.get('usuario') ?? '',
    password: ''
  })

  readonly loginForm = form(this.model, (ruta) => {
    required(ruta.username, {message: 'El usuario es obligatorio'})
    required(ruta.password, {message: 'La contraseña es obligatoria'})
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

  entrarConGoogle() {
    // Sale de la app hacia el back, que nos manda a Google (no es una ruta de Angular)
    window.location.href = `${environment.apiUrl}/oauth2/authorization/google`
  }
}
