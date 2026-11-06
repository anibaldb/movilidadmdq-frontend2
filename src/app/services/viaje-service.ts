import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { DireccionFavorita, DireccionNombre, Viaje, ViajeCalcular, ViajeCalcularResponse } from '../models/viaje-model';

@Service()
export class ViajeService {
    private readonly http = inject(HttpClient)

    toggleFavorito(viajeId: number) {
        return this.http.put<void>(`${environment.apiUrl}/viajes/${viajeId}/favorito`, null);
    }

    nombrarDireccionFav(id: number, datos: DireccionNombre){
        return this.http.put<void>(`${environment.apiUrl}/viajes/direcciones-favoritas/${id}`, datos)
    }

    eliminarDireccionFav(id: number){
        return this.http.delete<void>(`${environment.apiUrl}/viajes/direcciones-favoritas/${id}`)
    }

    calcularViaje(datos: ViajeCalcular){
        return this.http.post<ViajeCalcularResponse[]>(`${environment.apiUrl}/viajes/calcular`,datos)
    }

    obtenerViajesFavoritos(){
        return httpResource<Viaje[]>(() => ({
            url:`${environment.apiUrl}/viajes/favoritos`
        }))
    }

    obtenerDireccionesFavoritos(){
        return httpResource<DireccionFavorita[]>(() => ({
            url:`${environment.apiUrl}/viajes/direcciones-favoritas`
        }))
    }

    //Endpoints faltantes
    ///viajes/admin/destinos-populares
    ///viajes/admin/auditoria
}
