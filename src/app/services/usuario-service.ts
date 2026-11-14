import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service} from '@angular/core';
import { UsuarioActualizar, UsuarioActualizarResponse, UsuarioLogin, UsuarioRegistro, UsuarioAuth } from '../models/usuario-model';
import { environment } from '../../environments/environment';
import { ViajeFrecuente, ViajeHistorial } from '../models/viaje-model';

@Service()
export class UsuarioService {
    private readonly http = inject(HttpClient)

    actualizarPerfil(id: number, datos: UsuarioActualizar) {
        return this.http.put<UsuarioActualizarResponse>(`${environment.apiUrl}/usuarios/${id}`, datos);
    }

    eliminarUsuario(id: number){
        return this.http.delete<void>(`${environment.apiUrl}/usuarios/${id}`)
    }

    consultarBloqueo(query: string){
        return this.http.get<UsuarioActualizarResponse>(`${environment.apiUrl}/usuarios/buscar`, { params: { query } })
    }

    bloquearUsuario(id: number, bloqueado: boolean){
        return this.http.put<void>(`${environment.apiUrl}/usuarios/${id}/bloqueo`, null,{ params: { bloqueado }})
    }

    obtenerViajeFrecuente(id: number){
        return httpResource<ViajeFrecuente>(() => ({
            url:`${environment.apiUrl}/usuarios/${id}/viaje-frecuente`
        }))
    }

    obtenerHistorial(id: number){
        return httpResource<ViajeHistorial[]>(() => ({
            url:`${environment.apiUrl}/usuarios/${id}/historial`
        }))
    }

    obtenerUsuarioActual(){
        return httpResource<UsuarioActualizarResponse>(() => ({
            url:`${environment.apiUrl}/usuarios/me`
        }))
    }

    // Recibe una función con el texto a buscar: cada vez que cambia, se vuelve a pedir.
    // Si está vacío no se hace el pedido (httpResource queda en reposo).
    obtenerUsuario(query: () => string){
        return httpResource<UsuarioActualizarResponse>(() => {
            const texto = query()
            if (!texto) return undefined
            return {
                url:`${environment.apiUrl}/usuarios/buscar`,
                params:{query:texto}
            }
        })
    }

    eliminarUsuarioHistorial(id: number, viajeId: number){
        return this.http.delete<void>(`${environment.apiUrl}/usuarios/${id}/historial/${viajeId}`)
    }
}
