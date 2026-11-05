import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { UsuarioLogin, UsuarioAuth } from '../models/usuario-model';
import { Observable, tap } from 'rxjs';

interface JwtPayload{
    sub?:string,
    iat?:number,
    exp?:number,
}

@Service()
export class SesionService {
    private readonly http = inject(HttpClient)
    private readonly router = inject(Router)

    private readonly _usuario = signal<UsuarioAuth | null>(this.leerUsuario())

    readonly usuario = this._usuario.asReadonly()
    readonly token = computed(() => this.usuario()?.token ?? null)
    readonly esAdmin = computed(() => this.usuario()?.role === environment.roleAdmin)
    
    logueado(): boolean {
        const token = this.token()
        if(!token){
            return false
        }
        const exp = this.decode(token)?.exp
        return exp === undefined || exp * 1000 > Date.now()
    }

    login(credenciales: UsuarioLogin): Observable<UsuarioAuth> {
        return this.http.post<UsuarioAuth>(`${environment.apiUrl}/usuarios/login`, credenciales).pipe(tap((usuario) => this.guardarSesion(usuario)));
    }

    cerrarSesion(redirect = true): void {
        this.limpiarSesion()
        if(redirect){
            this.router.navigate(['/login'])
        }
    }

    private guardarSesion(usuario: UsuarioAuth): void {
        this.guardar(environment.tokenKey, JSON.stringify(usuario))
        this._usuario.set(usuario)
    }

    private limpiarSesion(): void {
        this.borrar(environment.tokenKey)
        this._usuario.set(null)
    }

    private leerUsuario(): UsuarioAuth | null {
    const raw = this.leer(environment.tokenKey)
    if (!raw) return null
        try {
            const usuario = JSON.parse(raw) as Partial<UsuarioAuth> | null
            return typeof usuario?.token === 'string' ? (usuario as UsuarioAuth) : null
        } catch {
            return null
        }
    }

    private leer(key: string): string | null {
        try {
            return localStorage.getItem(key)
        } catch {
            return null
        }
    }

    private guardar(key: string, value: string): void {
        try {
            localStorage.setItem(key, value)
        } catch {
            
        }
    }

    private borrar(key: string): void {
        try {
            localStorage.removeItem(key)
        } catch {
        
        }
    }

    private decode(token: string): JwtPayload | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join(''),
      );
      return JSON.parse(json) as JwtPayload
    } catch {
      return null
    }
  }
}
