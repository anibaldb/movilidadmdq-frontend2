import { Component, effect, inject, signal } from '@angular/core';
import { form, required, min, FormField } from '@angular/forms/signals';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';
import { TarifaService } from '../../services/tarifa-service';

@Component({
  selector: 'app-admin-tarifa',
  imports: [FormField, MensajeError],
  templateUrl: './admin-tarifa.html',
  styleUrl: './admin-tarifa.css',
})
export class AdminTarifa {
  private readonly tarifaService = inject(TarifaService);

  // GET /admin/tarifas/taxi: la tarifa vigente
  readonly tarifa = this.tarifaService.obtenerTarifaActual();

  // 1. Los datos del formulario: arrancan en 0 y se completan cuando llega la tarifa
  readonly model = signal({
    bajadaBanderaDia: 0,
    bajadaBanderaNoche: 0,
    valorFichaDia: 0,
    valorFichaNoche: 0,
    metrosPorFicha: 0,
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
  readonly error = signal('');
  readonly guardando = signal(false);

  constructor() {
    // Cuando llega la tarifa del back, se cargan sus valores en el formulario
    effect(() => {
      const t = this.tarifa.value();
      if (!t) return;
      this.model.set({
        bajadaBanderaDia: t.bajadaBanderaDia,
        bajadaBanderaNoche: t.bajadaBanderaNoche,
        valorFichaDia: t.valorFichaDia,
        valorFichaNoche: t.valorFichaNoche,
        metrosPorFicha: t.metrosPorFicha,
      });
    });
  }

  guardar(event: Event) {
    event.preventDefault(); // evita que el navegador recargue la página
    if (this.formTarifa().invalid()) return;

    this.mensajeGuardado.set('');
    this.error.set('');
    this.guardando.set(true);

    // PUT /admin/tarifas/taxi
    this.tarifaService.actualizarTarifa(this.model()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.mensajeGuardado.set('Tarifa actualizada.');
        this.tarifa.reload();
      },
      error: (e) => {
        this.guardando.set(false);
        this.error.set(e.error?.message ?? 'No se pudo guardar la tarifa. Probá de nuevo.');
      },
    });
  }
}