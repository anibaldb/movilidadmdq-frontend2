import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconButton } from '../../components/icon-button/icon-button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, IconButton],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // TODO SCRUM-18: reemplazar por sesion.usuario() y sesion.esAdmin() cuando esté el SesionService
  readonly nombreUsuario = signal('Viajero');
  readonly esAdmin = signal(false);

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
    // TODO SCRUM-18: this.sesion.cerrarSesion();
  }
}
