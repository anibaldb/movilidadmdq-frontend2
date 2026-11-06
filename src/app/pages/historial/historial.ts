import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ViajeHistorial } from '../../models/viaje-model';

// TODO SCRUM-18: cuando esté la sesión, reemplazar por
//   readonly historial = this.usuarioService.obtenerHistorial(this.sesion.usuario()!.id);
// y usar historial.value() en el HTML
const VIAJES_DE_PRUEBA: ViajeHistorial[] = [
  {
    id: 1, origen: 'Av. Colón 2090', destino: 'Jara 2022',
    distanciaEnMetros: 5000, tiempoEstimadoMin: 12,
    precioTaxi: 5800, precioUber: 5200, precioDidi: 5400,
    tipoElegido: 'UBER', fechaHora: '2026-09-12T18:30:00', favorito: false, username: 'anibal',
    origenPlaceId: '', origenLat: -38.0024, origenLng: -57.5578,
    destinoPlaceId: '', destinoLat: -37.9873, destinoLng: -57.5791,
  },
  {
    id: 2, origen: 'Plaza Mitre', destino: 'Estadio José María Minella',
    distanciaEnMetros: 8200, tiempoEstimadoMin: 18,
    precioTaxi: 4800, precioUber: 4200, precioDidi: 4100,
    tipoElegido: null, fechaHora: '2026-10-03T14:30:00', favorito: true, username: 'anibal',
    origenPlaceId: '', origenLat: -38.0045, origenLng: -57.5452,
    destinoPlaceId: '', destinoLat: -38.0285, destinoLng: -57.5871,
  },
];

@Component({
  selector: 'app-historial',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial {
  private router = inject(Router);

  readonly viajes = signal<ViajeHistorial[]>(VIAJES_DE_PRUEBA);

  // Lo que se muestra como precio: el transporte elegido o, si no eligió, el más barato
  etiquetaPrecio(viaje: ViajeHistorial): string {
    switch (viaje.tipoElegido) {
      case 'TAXI': return `Taxi: $${viaje.precioTaxi}`;
      case 'UBER': return `Uber: $${viaje.precioUber}`;
      case 'DIDI': return `Didi: $${viaje.precioDidi}`;
      default: return `Desde $${Math.min(viaje.precioTaxi, viaje.precioUber, viaje.precioDidi)}`;
    }
  }

  // Vuelve a Calcular con el mismo viaje
  repetir(viaje: ViajeHistorial) {
    this.router.navigate(['/calcular'], {
      queryParams: {
        origen: viaje.origen,
        destino: viaje.destino,
        origenLat: viaje.origenLat, origenLng: viaje.origenLng,
        destinoLat: viaje.destinoLat, destinoLng: viaje.destinoLng,
      },
    });
  }

  borrar(id: number) {
    // TODO SCRUM-18: usuarioService.eliminarUsuarioHistorial(idUsuario, id).subscribe(() => historial.reload())
    this.viajes.update((lista) => lista.filter((v) => v.id !== id));
  }
}
