import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { ComentarioCrear, ComentarioForo, Foro, ForoConComentarios, ForoCrear } from '../models/foro-model';

@Service()
export class ForoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/foros`;

  obtenerForos() {
    return httpResource<Foro[]>(() => this.url);
  }

  obtenerForo(id: number) {
    return httpResource<ForoConComentarios>(() => `${this.url}/${id}`);
  }

  crearForo(datos: ForoCrear) {
    return this.http.post<Foro>(this.url, datos);
  }

  comentar(foroId: number, datos: ComentarioCrear) {
    return this.http.post<ComentarioForo>(`${this.url}/${foroId}/comentarios`, datos);
  }

  eliminarForo(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}