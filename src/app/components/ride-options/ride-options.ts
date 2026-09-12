import { Component, input } from '@angular/core';
import { RideOptionCard, RideOption } from '../ride-option-card/ride-option-card';

const MOCK_OPTIONS: RideOption[] = [
  { id: '1', tipo: 'Económico', tiempoEstimado: '5 min', precio: 1200 },
  { id: '2', tipo: 'Estándar', tiempoEstimado: '4 min', precio: 1650 },
  { id: '3', tipo: 'Premium', tiempoEstimado: '3 min', precio: 2300 },
];

@Component({
  selector: 'app-ride-options',
  imports: [RideOptionCard],
  templateUrl: './ride-options.html',
  styleUrl: './ride-options.css',
})
export class RideOptions {
  hasRoute = input(false);
  options = MOCK_OPTIONS;
}
