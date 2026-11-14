import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from '../services/sesion.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sesion = inject(SesionService)
  const router = inject(Router)

  if(sesion.logueado()){
    return true
  }

  sesion.cerrarSesion(false)
  return router.createUrlTree(['/login'], {
    queryParams: {returnUrl: state.url}
  })
};

export const guestGuard: CanActivateFn = () => {
  const sesion = inject(SesionService)
  const router = inject(Router)
  return sesion.logueado() ? router.createUrlTree(['/']) : true
}

// Pantallas del cliente (calcular, historial, favoritos, perfil).
// Sin sesión → login (igual que authGuard). Admin → a sus pantallas.
export const clienteGuard: CanActivateFn = (route, state) => {
  const sesion = inject(SesionService)
  const router = inject(Router)

  if (!sesion.logueado()) {
    sesion.cerrarSesion(false)
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })
  }
  return sesion.esAdmin() ? router.createUrlTree(['/admin/tarifa']) : true
}
