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

    registrarUsuario(datos: UsuarioRegistro){
        return this.http.post<UsuarioAuth>(`${environment.apiUrl}/usuarios/registro`,datos)
    }

    obtenerViajeFrecuente(id: number){
        return httpResource<ViajeFrecuente>(() => ({
            url:`${environment.apiUrl}/usuarios/${id}/viaje-frecuente`
        }))
    }

    obtenerHistorial(id: number){
        return httpResource<ViajeHistorial>(() => ({
            url:`${environment.apiUrl}/usuarios/${id}/historial`
        }))
    }

    obtenerUsuarioActual(){
        return httpResource<UsuarioActualizarResponse>(() => ({
            url:`${environment.apiUrl}/usuarios/me`
        }))
    }

    obtenerUsuario(query: string){
        return httpResource<UsuarioActualizarResponse>(() => ({
            url:`${environment.apiUrl}/usuarios/buscar`,
            params:{query:query}
        }))
    }

    eliminarUsuarioHistorial(id: number, viajeId: number){
        return this.http.delete<void>(`${environment.apiUrl}/usuarios/${id}/historial/${viajeId}`)
    }
}
