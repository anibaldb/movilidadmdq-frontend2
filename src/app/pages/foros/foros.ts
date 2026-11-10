import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { form, required, pattern, maxLength, FormField } from '@angular/forms/signals';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';
import { ForoService } from '../../services/foro-service';
import { SesionService } from '../../services/sesion.service';
import { Foro, MAX_FOROS_POR_USUARIO } from '../../models/foro-model';

@Component({
  selector: 'app-foros',
  imports: [DatePipe, RouterLink, FormField, MensajeError],
  templateUrl: './foros.html',
  styleUrl: './foros.css',
})
export class Foros {
  private readonly foroService = inject(ForoService);
  readonly idUsuario = inject(SesionService).usuario()!.id;

  // GET /foros: los foros de todos, del más nuevo al más viejo
  readonly foros = this.foroService.obtenerForos();

  // Cuántos foros míos hay en la lista (para el contador x/5)
  readonly max = MAX_FOROS_POR_USUARIO;
  readonly misForos = computed(
    () => (this.foros.value() ?? []).filter((f) => f.autorId === this.idUsuario).length,
  );
  readonly llegoAlLimite = computed(() => this.misForos() >= this.max);

  readonly creando = signal(false);   // formulario abierto
  readonly enviando = signal(false);  // esperando al back
  readonly errorAccion = signal('');

  readonly model = signal({ titulo: '', descripcion: '' });
  readonly formForo = form(this.model, (campo) => {
    required(campo.titulo, { message: 'Ingresá un título.' });
    pattern(campo.titulo, /\S/, { message: 'Ingresá un título.' });
    maxLength(campo.titulo, 100, { message: 'Máximo 100 caracteres.' });
    maxLength(campo.descripcion, 1000, { message: 'Máximo 1000 caracteres.' });
  });

  abrirFormulario() {
    this.errorAccion.set('');
    this.model.set({ titulo: '', descripcion: '' });
    this.creando.set(true);
  }

  cancelar() {
    this.creando.set(false);
  }

  crear(event: Event) {
    event.preventDefault();
    if (this.formForo().invalid()) return;

    const { titulo, descripcion } = this.model();
    this.enviando.set(true);
    this.foroService.crearForo({ titulo: titulo.trim(), descripcion: descripcion.trim() || null }).subscribe({
      next: () => {
        this.creando.set(false);
        this.enviando.set(false);
        this.foros.reload();
      },
      error: (err: HttpErrorResponse) => {
        // 403 del back: "Ya tenés 5 foros…" o "Tu usuario está bloqueado…"
        this.errorAccion.set(this.mensajeDe(err, 'No se pudo crear el foro. Probá de nuevo.'));
        this.enviando.set(false);
      },
    });
  }

  eliminar(foro: Foro) {
    if (!confirm(`¿Borrar el foro "${foro.titulo}" y todos sus comentarios?`)) return;

    this.errorAccion.set('');
    this.foroService.eliminarForo(foro.id).subscribe({
      next: () => this.foros.reload(),
      error: (err: HttpErrorResponse) =>
        this.errorAccion.set(this.mensajeDe(err, 'No se pudo borrar el foro. Probá de nuevo.')),
    });
  }

  // El back manda el motivo en { message }; si no viene, usamos uno genérico
  private mensajeDe(err: HttpErrorResponse, porDefecto: string): string {
    return err.error?.message ?? porDefecto;
  }
}