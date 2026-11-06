import { Routes } from '@angular/router';
import { Calcular } from './pages/calcular/calcular';
import { Historial } from './pages/historial/historial';
import { Favoritos } from './pages/favoritos/favoritos';
import { Perfil } from './pages/perfil/perfil';
import { LogIn } from './pages/login/log-in/log-in';
import { Registro } from './pages/registro/registro';
import { authGuard, guestGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'calcular', component: Calcular},
  { path: 'login', component: LogIn, canActivate: [guestGuard] },
  { path: 'registro', component: Registro, canActivate: [guestGuard] },
  { path: 'historial', component: Historial, canActivate: [authGuard] },
  { path: 'favoritos', component: Favoritos, canActivate: [authGuard] },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] }, // TODO SCRUM-19: canActivate: [authGuard]
  { path: '', redirectTo: 'calcular', pathMatch: 'full' },
  { path: '**', redirectTo: 'calcular' },
];