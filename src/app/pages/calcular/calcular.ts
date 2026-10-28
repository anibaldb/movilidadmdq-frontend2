import { Component, signal } from '@angular/core';
import { form, required, pattern, FormField } from '@angular/forms/signals';
import { Map as AppMap } from '../../components/map/map';
import { RideOptions } from '../../components/ride-options/ride-options';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';

@Component({
  selector: 'app-calcular',
  imports: [FormField, MensajeError, AppMap, RideOptions],
  templateUrl: './calcular.html',
  styleUrl: './calcular.css',
})
export class Calcular {
  // 1. Los datos del formulario
  readonly model = signal({ origen: '', destino: '' });

  // 2. Las reglas: obligatorio y que no sea solo espacios
  readonly formRuta = form(this.model, (campo) => {
    required(campo.origen, { message: 'Ingresa el origen.' });
    pattern(campo.origen, /\S/, { message: 'Ingresa el origen.' });
    required(campo.destino, { message: 'Ingresa el destino.' });
    pattern(campo.destino, /\S/, { message: 'Ingresa el destino.' });
  });

  readonly hasRoute = signal(false);

  calcular(event: Event) {
    event.preventDefault(); // evita que el navegador recargue la página
    if (this.formRuta().invalid()) return;

    const origen = this.model().origen.trim();
    const destino = this.model().destino.trim();

    console.log('Ruta a calcular (mock):', origen, destino);
    this.hasRoute.set(true); // el pedido real al back va en SCRUM-30
  }
}