import { Component, input } from '@angular/core';

export interface RideOption {
  id: string;
  tipo: string;
  tiempoEstimado: string;
  precio: number;
}

@Component({
  selector: 'app-ride-option-card',
  imports: [],
  templateUrl: './ride-option-card.html',
  styleUrl: './ride-option-card.css',
})
export class RideOptionCard {
  option = input.required<RideOption>();
}
