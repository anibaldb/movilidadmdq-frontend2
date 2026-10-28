import { Component, input } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
  selector: 'app-mensaje-error',
  templateUrl: './mensaje-error.html',
  styleUrl: './mensaje-error.css',
})
export class MensajeError {
  // Recibe el estado de un campo del formulario
  readonly campo = input.required<FieldState<unknown>>();
}