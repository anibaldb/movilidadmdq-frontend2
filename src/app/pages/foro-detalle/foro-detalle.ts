import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { form, required, pattern, maxLength, FormField } from '@angular/forms/signals';
import { MensajeError } from '../../components/mensaje-error/mensaje-error';
import { ForoService } from '../../services/foro-service';
import { SesionService } from '../../services/sesion.service';
import { Autor } from '../../components/autor/autor/autor';

@Component({
  selector: 'app-foro-detalle',
  imports: [DatePipe, RouterLink, FormField, MensajeError, Autor],
  templateUrl: './foro-detalle.html',
  styleUrl: './foro-detalle.css',
})
export class ForoDetalle {
  private readonly foroService = inject(ForoService);
  readonly idUsuario = inject(SesionService).usuario()!.id;

  // El id viene de la URL: /foros/7 → 7
  private readonly idForo = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  // GET /foros/{id}: el foro con sus comentarios
  readonly foro = this.foroService.obtenerForo(this.idForo);

  readonly enviando = signal(false);
  readonly errorAccion = signal('');

  readonly model = signal({ texto: '' });
  readonly formComentario = form(this.model, (campo) => {
    required(campo.texto, { message: 'Escribí un comentario.' });
    pattern(campo.texto, /\S/, { message: 'Escribí un comentario.' });
    maxLength(campo.texto, 1000, { message: 'Máximo 1000 caracteres.' });
  });

  comentar(event: Event) {
    event.preventDefault();
    if (this.formComentario().invalid()) return;

    this.errorAccion.set('');
    this.enviando.set(true);
    this.foroService.comentar(this.idForo, { texto: this.model().texto.trim() }).subscribe({
      next: () => {
        this.model.set({ texto: '' });
        this.formComentario().reset(); // que no muestre "Escribí un comentario" con el campo recién vaciado
        this.enviando.set(false);
        this.foro.reload();
      },
      error: (err: HttpErrorResponse) => {
        // 403 si está bloqueado: mostramos el motivo que manda el back
        this.errorAccion.set(err.error?.message ?? 'No se pudo enviar el comentario. Probá de nuevo.');
        this.enviando.set(false);
      },
    });
  }
}