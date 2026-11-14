import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SesionService } from '../../../services/sesion.service';

@Component({
  selector: 'app-oauth2-redirect',
  templateUrl: './oauth2-redirect.html',
  styleUrl: './oauth2-redirect.css',
})
export class Oauth2Redirect {
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);

  constructor() {
    // El back vuelve acá con ?token=... (o ?error=... si algo falló)
    const token = inject(ActivatedRoute).snapshot.queryParamMap.get('token');

    if (!token) {
      this.volverAlLogin();
      return;
    }

    this.sesion.iniciarConToken(token).subscribe({
      // replaceUrl: saca de la historia del navegador la dirección con el token
      next: () => this.router.navigate(['/calcular'], { replaceUrl: true }),
      error: () => this.volverAlLogin(),
    });
  }

  private volverAlLogin() {
    this.router.navigate(['/login'], { queryParams: { error: 'google' }, replaceUrl: true });
  }
}