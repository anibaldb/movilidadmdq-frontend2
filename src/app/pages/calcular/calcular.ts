import { Component, ElementRef, afterNextRender, computed,inject, signal, viewChild } from '@angular/core';
import { form, required, pattern, FormField } from '@angular/forms/signals';
import { Map as AppMap } from '../../components/map/map';
import { RideOptions } from '../../components/ride-options/ride-options';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';
import { ActivatedRoute } from '@angular/router';
import { ViajeService } from '../../services/viaje-service';
import { ViajeCalcular, ViajeCalcularResponse } from '../../models/viaje-model';

type Campo = 'origen' | 'destino';
// Lo que recibe el mapa: coordenadas o, si no hay, el texto de la dirección
type Punto = string | google.maps.LatLngLiteral;

// Rectángulo que cubre Mar del Plata (el mismo que usa frontend1)
const LIMITES_MDP = { north: -37.85, south: -38.15, east: -57.45, west: -57.75 };

interface DetalleLugar{
  placeId:string
  linea1:string
  linea2:string
}

const SIN_DETALLE: DetalleLugar = { placeId: '', linea1: '', linea2: '' }

@Component({
  selector: 'app-calcular',
  imports: [FormField, MensajeError, AppMap, RideOptions],
  templateUrl: './calcular.html',
  styleUrl: './calcular.css',
})
export class Calcular {

  private readonly route = inject(ActivatedRoute);
  private readonly viajeService = inject(ViajeService)
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

  // place_id y líneas de dirección de lo elegido en las sugerencias (vacío = se escribió a mano)
  readonly detalles = signal<Record<Campo, DetalleLugar>>({
    origen: SIN_DETALLE,
    destino: SIN_DETALLE
  })

  // Opciones (Taxi, Uber, Didi...) que devolvió el backend
  readonly opciones = signal<ViajeCalcularResponse[]>([]);
  readonly calculando = signal(false);
  readonly errorCalculo = signal('');

  // La ruta pedida al tocar Calcular (null = todavía no se calculó nada)
  readonly rutaBuscada = signal<{ origen: Punto; destino: Punto } | null>(null);
  readonly hasRoute = computed(() => this.rutaBuscada() !== null);

  // Los <input> del HTML (marcados con #inputOrigen y #inputDestino)
  private readonly inputOrigen = viewChild.required<ElementRef<HTMLInputElement>>('inputOrigen');
  private readonly inputDestino = viewChild.required<ElementRef<HTMLInputElement>>('inputDestino');

  constructor() {

    this.cargarViajeRepetido();
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
      fields: ['formatted_address', 'geometry', 'place_id', 'name', 'address_components'], // solo lo que usamos (Google cobra por campo)
    });

    // Google avisa cuando el usuario elige una sugerencia
    autocompletado.addListener('place_changed', () => {
      const lugar = autocompletado.getPlace();
      const ubicacion = lugar.geometry?.location;
      if (!ubicacion) return; // escribió algo sin elegir de la lista

      this.model.update((m) => ({ ...m, [campo]: lugar.formatted_address ?? input.value }));
      this.coords.update((c) => ({ ...c, [campo]: ubicacion.toJSON() }));
      this.detalles.update((d) => ({...d, [campo]: this.detalleDe(lugar)}))
    });
  }

  // Si vuelve a escribir, las coordenadas que teníamos ya no corresponden al texto
  borrarCoords(campo: Campo) {
    this.coords.update((c) => ({ ...c, [campo]: null }));
    this.detalles.update((d) => ({...d, [campo]: SIN_DETALLE}))
  }

  // Estado del botón de GPS
  readonly buscandoUbicacion = signal(false);
  readonly errorUbicacion = signal('');

  usarMiUbicacion() {
    if (!navigator.geolocation) {
      this.errorUbicacion.set('Tu navegador no permite obtener la ubicación.');
      return;
    }

    this.buscandoUbicacion.set(true);
    this.errorUbicacion.set('');

    navigator.geolocation.getCurrentPosition(
      // Si da permiso: guardamos las coordenadas y mostramos la dirección
      async (posicion) => {
        const ubicacion = { lat: posicion.coords.latitude, lng: posicion.coords.longitude };
        this.coords.update((c) => ({ ...c, origen: ubicacion }));
        const { direccion, detalle } = await this.direccionDe(ubicacion);
        this.detalles.update((d) => ({...d, origen: detalle}))
        this.model.update((m) => ({ ...m, origen: direccion }));
        this.buscandoUbicacion.set(false);
      },
      // Si no da permiso o falla
      () => {
        this.errorUbicacion.set('No pudimos obtener tu ubicación. Revisá los permisos del navegador.');
        this.buscandoUbicacion.set(false);
      },
    );
  }

  // Convierte coordenadas en una dirección (y sus datos para el backend) para mostrar en el campo
  private async direccionDe(ubicacion: google.maps.LatLngLiteral): Promise<{ direccion: string; detalle: DetalleLugar }> {
    const { Geocoder } = (await google.maps.importLibrary('geocoding')) as google.maps.GeocodingLibrary;
    try {
      const { results } = await new Geocoder().geocode({ location: ubicacion });
      return{
        direccion: results[0]?.formatted_address ?? 'Mi ubicación',
        detalle: results[0] ? this.detalleDe(results[0]) : SIN_DETALLE
      }
    } catch {
      return { direccion: 'Mi ubicación', detalle: SIN_DETALLE }; // si Google no encuentra la dirección, igual tenemos las coordenadas
    }
  }

  calcular(event: Event) {
    event.preventDefault(); // evita que el navegador recargue la página
    if (this.formRuta().invalid()) return;

    this.pedirOpciones()
  }

  // Pide al backend el cálculo y guarda las opciones que devuelve
  private pedirOpciones() {
    const datos = this.datosViaje();
    if (!datos) {
      this.errorCalculo.set('Elegí el origen y el destino de la lista de sugerencias.');
      return;
    }

    this.errorCalculo.set('');
    this.opciones.set([]);
    this.calculando.set(true);
    // El mapa traza la ruta enseguida; las opciones llegan cuando responde el backend
    this.rutaBuscada.set({ origen: this.punto('origen'), destino: this.punto('destino') });

    this.viajeService.calcularViaje(datos).subscribe({
      next: (opciones) => {
        this.opciones.set(opciones);
        this.calculando.set(false);
      },
      error: () => {
        this.errorCalculo.set('No pudimos calcular las opciones. Probá de nuevo.');
        this.calculando.set(false);
      },
    });
  }

  // Arma lo que pide el backend. Sin coordenadas (se escribió a mano) no se puede calcular.
  private datosViaje(): ViajeCalcular | null {
    const { origen: coordsOrigen, destino: coordsDestino } = this.coords();
    if (!coordsOrigen || !coordsDestino) return null;

    const origen = this.lineas('origen');
    const destino = this.lineas('destino');

    return {
      origen: origen.linea1,
      destino: destino.linea1,
      origenAddressLine1: origen.linea1,
      origenAddressLine2: origen.linea2,
      origenPlaceId: this.detalles().origen.placeId,
      origenLat: coordsOrigen.lat,
      origenLng: coordsOrigen.lng,
      destinoAddressLine1: destino.linea1,
      destinoAddressLine2: destino.linea2,
      destinoPlaceId: this.detalles().destino.placeId,
      destinoLat: coordsDestino.lat,
      destinoLng: coordsDestino.lng,
    };
  }

  // Si no hay datos de Google (por ejemplo, un viaje repetido) se usa el texto del campo
  private lineas(campo: Campo) {
    const texto = this.model()[campo].trim();
    const { linea1, linea2 } = this.detalles()[campo];
    return { linea1: linea1 || texto, linea2: linea2 || texto };
  }

  // Saca de un resultado de Google (autocompletado o geocoder) lo que pide el backend
  private detalleDe(lugar: {
    name?: string;
    place_id?: string;
    address_components?: google.maps.GeocoderAddressComponent[];
  }): DetalleLugar {
    const parte = (tipo: string) =>
      lugar.address_components?.find((c) => c.types.includes(tipo))?.long_name ?? '';
    const calle = [parte('route'), parte('street_number')].filter(Boolean).join(' ');
    return {
      placeId: lugar.place_id ?? '',
      linea1: lugar.name ?? calle,
      linea2: [calle, parte('locality')].filter(Boolean).join(', '),
    };
  }

  // Coordenadas si eligió una sugerencia; si no, el texto con la ciudad
  private punto(campo: Campo): Punto {
    return this.coords()[campo] ?? `${this.model()[campo].trim()}, Mar del Plata`;
  }

    // Si viene de "Repetir" en el historial, completa el formulario y traza la ruta
  private cargarViajeRepetido() {
    const params = this.route.snapshot.queryParamMap;
    const origen = params.get('origen');
    const destino = params.get('destino');
    if (!origen || !destino) return; // entró normal, sin viaje para repetir

    this.model.set({ origen, destino });
    this.coords.set({
      origen: this.coordenadaDe(params.get('origenLat'), params.get('origenLng')),
      destino: this.coordenadaDe(params.get('destinoLat'), params.get('destinoLng')),
    });
    this.detalles.set({
      origen: { ...SIN_DETALLE, placeId: params.get('origenPlaceId') ?? '' },
      destino: { ...SIN_DETALLE, placeId: params.get('destinoPlaceId') ?? '' },
    });
    this.rutaBuscada.set({ origen: this.punto('origen'), destino: this.punto('destino') });
  }

  // En la URL todo es texto: "-38.0024" → número. Si falta alguno, no hay coordenada
  private coordenadaDe(lat: string | null, lng: string | null): google.maps.LatLngLiteral | null {
    if (!lat || !lng) return null;
    return { lat: Number(lat), lng: Number(lng) };
  }
}