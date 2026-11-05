import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SesionService } from '../services/sesion.service';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sesion = inject(SesionService)
  const token = sesion.token()

  const isApiCall = req.url.startsWith(environment.apiUrl)
  const isPublicCall = req.url.endsWith('/usuarios/login') || req.url.endsWith('/usuarios/registro')
  const authReq =
    token && isApiCall && !isPublicCall
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if(err.status === 401 && isApiCall && !isPublicCall){
        sesion.cerrarSesion()
      }
      return throwError(() => err)
    })
  )
};
