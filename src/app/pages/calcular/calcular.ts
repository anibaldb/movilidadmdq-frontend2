import { Component, ElementRef, afterNextRender, computed, signal, viewChild } from '@angular/core';
import { form, required, pattern, FormField } from '@angular/forms/signals';
import { Map as AppMap } from '../../components/map/map';
import { RideOptions } from '../../components/ride-options/ride-options';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';

type Campo = 'origen' | 'destino';
// Lo que recibe el mapa: coordenadas o, si no hay, el texto de la dirección
type Punto = string | google.maps.LatLngLiteral;

// Rectángulo que cubre Mar del Plata (el mismo que usa frontend1)
const LIMITES_MDP = { north: -37.85, south: -38.15, east: -57.45, west: -57.75 };

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

  // Coordenadas de la dirección elegida en las sugerencias (null = se escribió a mano)
  readonly coords = signal<Record<Campo, google.maps.LatLngLiteral | null>>({
    origen: null,
    destino: null,
  });

  // La ruta pedida al tocar Calcular (null = todavía no se calculó nada)
  readonly rutaBuscada = signal<{ origen: Punto; destino: Punto } | null>(null);
  readonly hasRoute = computed(() => this.rutaBuscada() !== null);

  // Los <input> del HTML (marcados con #inputOrigen y #inputDestino)
  private readonly inputOrigen = viewChild.required<ElementRef<HTMLInputElement>>('inputOrigen');
  private readonly inputDestino = viewChild.required<ElementRef<HTMLInputElement>>('inputDestino');

  constructor() {
    // Cuando la pantalla ya está dibujada, se conecta el autocompletado a los dos inputs
    afterNextRender(async () => {
      await google.maps.importLibrary('places');
      this.conectarAutocompletado(this.inputOrigen().nativeElement, 'origen');
      this.conectarAutocompletado(this.inputDestino().nativeElement, 'destino');
    });
  }

  private conectarAutocompletado(input: HTMLInputElement, campo: Campo) {
    const autocompletado = new google.maps.places.Autocomplete(input, {
      bounds: LIMITES_MDP,
      strictBounds: true, // solo direcciones dentro de Mar del Plata
      componentRestrictions: { country: 'ar' },
      fields: ['formatted_address', 'geometry'], // solo lo que usamos (Google cobra por campo)
    });

    // Google avisa cuando el usuario elige una sugerencia
    autocompletado.addListener('place_changed', () => {
      const lugar = autocompletado.getPlace();
      const ubicacion = lugar.geometry?.location;
      if (!ubicacion) return; // escribió algo sin elegir de la lista

      this.model.update((m) => ({ ...m, [campo]: lugar.formatted_address ?? input.value }));
      this.coords.update((c) => ({ ...c, [campo]: ubicacion.toJSON() }));
    });
  }

  // Si vuelve a escribir, las coordenadas que teníamos ya no corresponden al texto
  borrarCoords(campo: Campo) {
    this.coords.update((c) => ({ ...c, [campo]: null }));
  }

  calcular(event: Event) {
    event.preventDefault(); // evita que el navegador recargue la página
    if (this.formRuta().invalid()) return;

    this.rutaBuscada.set({ origen: this.punto('origen'), destino: this.punto('destino') });
  }

  // Coordenadas si eligió una sugerencia; si no, el texto con la ciudad
  private punto(campo: Campo): Punto {
    return this.coords()[campo] ?? `${this.model()[campo].trim()}, Mar del Plata`;
  }
}