import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Tarifa, TarifaActualizar } from '../models/tarifa-model';
import { environment } from '../../environments/environment';

@Service()
export class TarifaService {
    private readonly http = inject(HttpClient)

    obtenerTarifaActual(){
        return httpResource<Tarifa>(() => ({
            url:`${environment.apiUrl}/admin/tarifas/taxi`
        }))
    }

    actualizarTarifa(datos: TarifaActualizar) {
        return this.http.put<Tarifa>(`${environment.apiUrl}/admin/tarifas/taxi`, datos);
    }
}
