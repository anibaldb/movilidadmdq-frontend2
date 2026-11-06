import { Component, signal } from '@angular/core';
import { form, required, pattern, FormField } from '@angular/forms/signals';
import { DireccionFavorita } from '../../models/viaje-model';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';

// TODO SCRUM-18: reemplazar por viajeService.obtenerDireccionesFavoritos() y usar .value() en el HTML
const DIRECCIONES_DE_PRUEBA: DireccionFavorita[] = [
  { id: 1, nombre: 'Casa', direccion: 'Av. Colón 2090, Mar del Plata', placeId: '', lat: -38.0024, lng: -57.5578 },
  { id: 2, nombre: null, direccion: 'Jara 2022, Mar del Plata', placeId: '', lat: -37.9873, lng: -57.5791 },
  { id: 3, nombre: 'Facultad', direccion: 'Juan B. Justo 4302, Mar del Plata', placeId: '', lat: -38.0177, lng: -57.5795 },
];

@Component({
  selector: 'app-favoritos',
  imports: [FormField, MensajeError],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class Favoritos {
  readonly direcciones = signal<DireccionFavorita[]>(DIRECCIONES_DE_PRUEBA);

  // Cuál se está renombrando (null = ninguna)
  readonly editandoId = signal<number | null>(null);

  // Formulario del nombre: uno solo, se reusa para la dirección que se esté editando
  readonly modelNombre = signal({ nombre: '' });
  readonly formNombre = form(this.modelNombre, (campo) => {
    required(campo.nombre, { message: 'Ingresa un nombre.' });
    pattern(campo.nombre, /\S/, { message: 'Ingresa un nombre.' });
  });

  empezarAEditar(direccion: DireccionFavorita) {
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
    // TODO SCRUM-18: viajeService.nombrarDireccionFav(id, { nombre }).subscribe(() => direcciones.reload())
    this.direcciones.update((lista) => lista.map((d) => (d.id === id ? { ...d, nombre } : d)));
    this.editandoId.set(null);
  }

  eliminar(id: number) {
    // TODO SCRUM-18: viajeService.eliminarDireccionFav(id).subscribe(() => direcciones.reload())
    this.direcciones.update((lista) => lista.filter((d) => d.id !== id));
  }
}