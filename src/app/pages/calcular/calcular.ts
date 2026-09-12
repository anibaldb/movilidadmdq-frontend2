import { Component, signal } from '@angular/core';
import { RouteForm, RouteRequest } from '../../components/route-form/route-form';
import { Map as AppMap } from '../../components/map/map';
import { RideOptions } from '../../components/ride-options/ride-options';

@Component({
  selector: 'app-calcular',
  imports: [RouteForm, AppMap, RideOptions],
  templateUrl: './calcular.html',
  styleUrl: './calcular.css',
})
export class Calcular {
  hasRoute = signal(false);

  onCalcular(ruta: RouteRequest) {
    console.log('Ruta a calcular (mock):', ruta);
    this.hasRoute.set(true);
  }
}
