import { Component, inject, signal } from '@angular/core';
import { form, required, pattern, FormField } from '@angular/forms/signals';
import { DireccionFavorita } from '../../models/viaje-model';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';
import { ViajeService } from '../../services/viaje-service';

@Component({
  selector: 'app-favoritos',
  imports: [FormField, MensajeError],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class Favoritos {
  private readonly viajeService = inject(ViajeService);

  // GET /viajes/direcciones-favoritas: el back sabe de quién son por el token
  readonly direcciones = this.viajeService.obtenerDireccionesFavoritos();

  // Mensaje si falla renombrar o eliminar
  readonly errorAccion = signal('');

  // Cuál se está renombrando (null = ninguna)
  readonly editandoId = signal<number | null>(null);

  // Formulario del nombre: uno solo, se reusa para la dirección que se esté editando
  readonly modelNombre = signal({ nombre: '' });
  readonly formNombre = form(this.modelNombre, (campo) => {
    required(campo.nombre, { message: 'Ingresa un nombre.' });
    pattern(campo.nombre, /\S/, { message: 'Ingresa un nombre.' });
  });

  empezarAEditar(direccion: DireccionFavorita) {
    this.errorAccion.set('');
    this.modelNombre.set({ nombre: direccion.nombre ?? '' }); // arranca con el nombre actual
    this.editandoId.set(direccion.id);
  }

  cancelar() {
    this.editandoId.set(null);
  }

  guardarNombre(event: Event, id: number) {
    event.preventDefault();
    if (this.formNombre().invalid()) return;

    const nombre = this.modelNombre().nombre.trim();
    this.viajeService.nombrarDireccionFav(id, { nombre }).subscribe({
      next: () => {
        this.editandoId.set(null);
        this.direcciones.reload();
      },
      error: () => this.errorAccion.set('No se pudo guardar el nombre. Probá de nuevo.'),
    });
  }

  eliminar(id: number) {
    this.errorAccion.set('');
    this.viajeService.eliminarDireccionFav(id).subscribe({
      next: () => this.direcciones.reload(),
      error: () => this.errorAccion.set('No se pudo eliminar la dirección. Probá de nuevo.'),
    });
  }
}