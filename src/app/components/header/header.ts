import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconButton } from '../../components/icon-button/icon-button';
import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, IconButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly sesion = inject(SesionService)
  
  readonly nombreUsuario = computed(() => this.sesion.usuario()?.username ?? 'Viajero');
  readonly esAdmin = this.sesion.esAdmin;

  // ¿El menú desplegable está abierto?
  readonly menuAbierto = signal(false);

  alternarMenu() {
    this.menuAbierto.update((abierto) => !abierto);
  }

  cerrarMenu() {
    this.menuAbierto.set(false);
  }

  cerrarSesion() {
    this.cerrarMenu();
    this.sesion.cerrarSesion();
  }
}
