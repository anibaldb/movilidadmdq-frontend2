import { Component, effect, inject, input, signal } from '@angular/core';
import { GoogleMap, MapDirectionsRenderer, MapDirectionsService } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  imports: [GoogleMap, MapDirectionsRenderer],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  private directionsService = inject(MapDirectionsService);

  /// Lo que manda la página: coordenadas, o texto si la dirección se escribió a mano
  readonly origen = input<string | google.maps.LatLngLiteral>();
  readonly destino = input<string | google.maps.LatLngLiteral>();

  // La ruta que devuelve Google (undefined = no hay ruta para dibujar)
  readonly ruta = signal<google.maps.DirectionsResult | undefined>(undefined);

  readonly center: google.maps.LatLngLiteral = { lat: -38.0055, lng: -57.5426 };
  readonly zoom = 13;
  readonly mapOptions: google.maps.MapOptions = { disableDefaultUI: true, zoomControl: true };

  // Línea negra y gruesa, igual que frontend1
  readonly opcionesRuta: google.maps.DirectionsRendererOptions = {
    polylineOptions: { strokeColor: '#000000', strokeWeight: 5 },
  };

  constructor() {
    // Se ejecuta solo cada vez que cambian origen o destino
    effect(() => {
      const origen = this.origen();
      const destino = this.destino();

      if (!origen || !destino) {
        this.ruta.set(undefined);
        return;
      }

      this.directionsService
        .route({ origin: origen, destination: destino, travelMode: google.maps.TravelMode.DRIVING })
        .subscribe(({ result, status }) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.ruta.set(result);
          } else {
            console.error('No se pudo trazar la ruta:', status);
            this.ruta.set(undefined);
          }
        });
    });
  }
}