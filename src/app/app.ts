import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { NavTabs } from './components/nav-tabs/nav-tabs';

@Component({
  imports: [RouterOutlet, Header, NavTabs],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('FrontendMovilidadMDP');
}
