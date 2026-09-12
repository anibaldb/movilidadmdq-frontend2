import { Component, output, signal } from '@angular/core';
import { LocationInput } from '../location-input/location-input';

export interface RouteRequest {
  origen: string;
  destino: string;
}

@Component({
  selector: 'app-route-form',
  imports: [LocationInput],
  templateUrl: './route-form.html',
  styleUrl: './route-form.css',
})
export class RouteForm {
  origen = signal('');
  destino = signal('');

  calcular = output<RouteRequest>();

  onCalcular() {
    this.calcular.emit({
      origen: this.origen(),
      destino: this.destino(),
    });
  }
}
