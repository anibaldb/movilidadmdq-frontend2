import { Component, input } from '@angular/core';
import { IconButton } from '../icon-button/icon-button';

@Component({
  imports: [IconButton],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  userName = input('NombreUsuario(esta harcodeado por ahora)')
}
