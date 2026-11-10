import { Component, computed, input } from '@angular/core';
import { RideOption, RideOptionCard } from '../ride-option-card/ride-option-card';
import { ViajeCalcularResponse } from '../../models/viaje-model';

function aRideOption(opcion:ViajeCalcularResponse):RideOption{
  return{
    id:opcion.tipo, 
    tipo:opcion.tipo,
    tiempoEstimado:`${opcion.tiempoMinutos} min`,
    precio:opcion.precio,
    url:opcion.url
  };
}

@Component({
  selector: 'app-ride-options',
  imports: [RideOptionCard],
  templateUrl: './ride-options.html',
  styleUrl: './ride-options.css',
})
export class RideOptions {
  hasRoute = input(false);
  cargando = input(false)
  options = input<ViajeCalcularResponse[]>([])

  readonly opciones = computed(() => this.options().map(aRideOption))
}
