import { Routes } from '@angular/router';
import { Calcular } from './pages/calcular/calcular';
import { Historial } from './pages/historial/historial';
import { Favoritos } from './pages/favoritos/favoritos';

export const routes: Routes = [
  { path: 'calcular', component: Calcular },
  { path: 'historial', component: Historial },
  { path: 'favoritos', component: Favoritos },
  { path: '', redirectTo: 'calcular', pathMatch: 'full' },
  { path: '**', redirectTo: 'calcular' },
];