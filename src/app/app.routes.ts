import { Routes } from '@angular/router';
import { Calcular } from './pages/calcular/calcular';
import { Historial } from './pages/historial/historial';
import { Favoritos } from './pages/favoritos/favoritos';
import { Perfil } from './pages/perfil/perfil';

export const routes: Routes = [
  { path: 'calcular', component: Calcular },
  { path: 'historial', component: Historial },
  { path: 'favoritos', component: Favoritos },
  { path: 'perfil', component: Perfil }, // TODO SCRUM-19: canActivate: [authGuard]
  { path: '', redirectTo: 'calcular', pathMatch: 'full' },
  { path: '**', redirectTo: 'calcular' },
];