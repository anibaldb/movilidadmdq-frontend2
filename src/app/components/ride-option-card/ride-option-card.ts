import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ViajeService } from '../../services/viaje-service';
import { TipoTransporte } from '../../models/tarifa-model';

export interface RideOption {
  id: string;
  tipo: string;
  tiempoEstimado: string;
  precio: number;
  url: string;
  viajeId: number | null;
}

@Component({
  selector: 'app-ride-option-card',
  imports: [DecimalPipe],
  templateUrl: './ride-option-card.html',
  styleUrl: './ride-option-card.css',
})
export class RideOptionCard {
  private readonly viajeService = inject(ViajeService);

  option = input.required<RideOption>();

  // El taxi no es una app: el back manda "tel:..." para llamar a la radio
  readonly esLlamada = computed(() => this.option().url.startsWith('tel:'));

  // Avisa al back qué opción eligió el usuario (para los informes).
  // No espera la respuesta: el link redirige igual, y si falla no se muestra nada.
  registrarEleccion() {
    const { viajeId, tipo } = this.option();
    if (viajeId == null) return;

    this.viajeService.registrarEleccion(viajeId, tipo as TipoTransporte)
      .subscribe({ error: () => {} });
  }
}