import { Component, signal } from '@angular/core';
import { form, required, min, FormField } from '@angular/forms/signals';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';

@Component({
  selector: 'app-admin-tarifa',
  imports: [FormField, MensajeError],
  templateUrl: './admin-tarifa.html',
  styleUrl: './admin-tarifa.css',
})
export class AdminTarifa {
  // 1. Los datos del formulario (los mismos campos que TarifaRequest del back)
  // TODO SCRUM-18: cargar la tarifa vigente desde GET /admin/tarifas/taxi
  readonly model = signal({
    bajadaBanderaDia: 2250,
    bajadaBanderaNoche: 2700,
    valorFichaDia: 150,
    valorFichaNoche: 180,
    metrosPorFicha: 160,
  });

  // 2. Las reglas: todos obligatorios y sin valores negativos
  readonly formTarifa = form(this.model, (campo) => {
    required(campo.bajadaBanderaDia, { message: 'Ingresa la bajada de bandera de día.' });
    min(campo.bajadaBanderaDia, 0, { message: 'No puede ser negativa.' });

    required(campo.bajadaBanderaNoche, { message: 'Ingresa la bajada de bandera de noche.' });
    min(campo.bajadaBanderaNoche, 0, { message: 'No puede ser negativa.' });

    required(campo.valorFichaDia, { message: 'Ingresa el valor de la ficha de día.' });
    min(campo.valorFichaDia, 0, { message: 'No puede ser negativo.' });

    required(campo.valorFichaNoche, { message: 'Ingresa el valor de la ficha de noche.' });
    min(campo.valorFichaNoche, 0, { message: 'No puede ser negativo.' });

    required(campo.metrosPorFicha, { message: 'Ingresa los metros por ficha.' });
    min(campo.metrosPorFicha, 1, { message: 'Debe ser al menos 1 metro.' });
  });

  readonly mensajeGuardado = signal('');

  guardar(event: Event) {
    event.preventDefault(); // evita que el navegador recargue la página
    if (this.formTarifa().invalid()) return;

    // TODO SCRUM-18: PUT /admin/tarifas/taxi con this.model()
    console.log('Tarifa a guardar (mock):', this.model());
    this.mensajeGuardado.set('Tarifa actualizada.');
  }
}
