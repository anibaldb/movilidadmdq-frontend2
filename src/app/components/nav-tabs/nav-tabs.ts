import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SesionService } from '../../services/sesion.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-nav-tabs',
  styleUrl: './nav-tabs.css',
  templateUrl: './nav-tabs.html',
})
export class NavTabs {
  // Admin y cliente ven pestañas distintas (igual que en el menú de celular)
  readonly esAdmin = inject(SesionService).esAdmin;
}
