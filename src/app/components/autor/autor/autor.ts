import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { SesionService } from '../../../services/sesion.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BloqueoService } from '../../../services/bloqueo-service';

@Component({
  imports: [],
  selector: 'app-autor',
  styleUrl: './autor.css',
  templateUrl: './autor.html',
})
export class Autor {
  private readonly sesion = inject(SesionService)
  private readonly bloqueos = inject(BloqueoService)

  readonly autorId = input.required<number>()
  readonly autor = input.required<string>()

  readonly autorBloqueado = input<boolean | undefined>(undefined)

  readonly puedeBloquear = computed(
    () => this.sesion.esAdmin() && this.autorId() !== this.sesion.usuario()?.id,
  )

  readonly bloqueado = computed(() => this.bloqueos.estaBloqueado(this.autorId()) ?? false)

  readonly abierto = signal(false)
  readonly cambiando = signal(false)
  readonly error = signal('')
  readonly accion = signal<'bloquear' | 'desbloquear' | null>(null)

  constructor() {
    effect(() => {
      const inicial = this.autorBloqueado()
      if (inicial !== undefined) this.bloqueos.fijar(this.autorId(), inicial)
    });

    effect(() => {
      if (this.puedeBloquear() && this.autorBloqueado() === undefined) {
        this.bloqueos.cargar(this.autorId(), this.autor())
      }
    })
  }

  alternar() {
    this.error.set('')
    this.accion.set(null)
    this.abierto.update((abierto) => !abierto)
  }

  pedirConfirmacion() {
    this.error.set('')
    this.accion.set(this.bloqueado() ? 'desbloquear' : 'bloquear')
  }

  cancelar() {
    this.error.set('')
    this.accion.set(null)
  }

  confirmar() {
    const accion = this.accion()
    if (!accion) return
    const bloquear = accion === 'bloquear'

    this.error.set('')
    this.cambiando.set(true)
    this.bloqueos.cambiar(this.autorId(), bloquear).subscribe({
      next: () => {
        this.cambiando.set(false)
        this.accion.set(null)
        this.abierto.set(false)
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.error?.message ?? `No se pudo ${bloquear ? 'bloquear' : 'desbloquear'} al usuario. Probá de nuevo.`
        )
        this.cambiando.set(false)
      }
    })
  }
}
