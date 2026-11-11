import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface RideOption {
  id: string;
  tipo: string;
  tiempoEstimado: string;
  precio: number;
  url: string;
}

@Component({
  selector: 'app-ride-option-card',
  imports: [DecimalPipe],
  templateUrl: './ride-option-card.html',
  styleUrl: './ride-option-card.css',
})
export class RideOptionCard {
  option = input.required<RideOption>();

  // El taxi no es una app: el back manda "tel:..." para llamar a la radio
  readonly esLlamada = computed(() => this.option().url.startsWith('tel:'));
}
