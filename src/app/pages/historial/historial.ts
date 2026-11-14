import { Component, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ViajeHistorial } from '../../models/viaje-model';
import { SesionService } from '../../services/sesion.service';
import { UsuarioService } from '../../services/usuario-service';
import { ViajeService } from '../../services/viaje-service';

@Component({
  selector: 'app-historial',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial {
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioService);
  private readonly viajeService = inject(ViajeService);

  // El authGuard ya garantiza que hay sesión, por eso el "!"
  private readonly idUsuario = inject(SesionService).usuario()!.id;

  // GET /usuarios/{id}/historial: se pide solo al abrir la pantalla
  readonly historial = this.usuarioService.obtenerHistorial(this.idUsuario);

  // Mensaje si falla borrar o marcar favorito
  readonly errorAccion = signal('');

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
    this.errorAccion.set('');
    this.usuarioService.eliminarUsuarioHistorial(this.idUsuario, id).subscribe({
      next: () => this.historial.reload(),
      error: () => this.errorAccion.set('No se pudo borrar el viaje. Probá de nuevo.'),
    });
  }

  marcarFavorito(id: number) {
    this.errorAccion.set('');
    this.viajeService.toggleFavorito(id).subscribe({
      next: () => this.historial.reload(),
      error: () => this.errorAccion.set('No se pudo actualizar el favorito. Probá de nuevo.'),
    });
  }
}