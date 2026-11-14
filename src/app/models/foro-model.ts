export const MAX_FOROS_POR_USUARIO = 5;

export interface Foro {
  id: number;
  titulo: string;
  descripcion: string | null;
  autorId: number;
  autor: string;
  fechaCreacion: string;
  cantidadComentarios: number;
}

export interface ComentarioForo {
  id: number;
  texto: string;
  autorId: number;
  autor: string;
  fecha: string;
}

// GET /foros/{id}: el foro con todos sus comentarios
export interface ForoConComentarios extends Omit<Foro, 'cantidadComentarios'> {
  comentarios: ComentarioForo[];
}

export type ForoCrear = Pick<Foro, 'titulo' | 'descripcion'>;
export type ComentarioCrear = Pick<ComentarioForo, 'texto'>;