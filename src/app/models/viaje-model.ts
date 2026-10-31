import { TipoTransporte } from "./tarifa-model";

export interface Viaje{
    id: 123,
    origen:string,
    destino:string,
    distanciaEnMetros:number,
    tiempoEstimadoMin:number,
    precioTaxi:number,
    precioUber:number,
    precioDidi:number,
    tipoElegido:TipoTransporte,
    fechaHora:string,
    favorito:boolean,
    username:string,
    origenPlaceId:string,
    origenLat:number,
    origenLng:number,
    destinoPlaceId:string,
    destinoLat:number,
    destinoLng:number,
    cantidad:number
}

export type ViajeFrecuente = Pick<Viaje, 'origen' | 'destino' | 'cantidad'>
export type ViajeHistorial = Omit<Viaje, 'cantidad'>

export interface DireccionFavorita{
    id:number,
    nombre:string,
    direccion:string,
    placeId:string,
    lat:number,
    lng:number
}

export type DireccionNombre = Pick<DireccionFavorita, 'nombre'>

export interface ViajeCalcular{
  origen:string,
  destino:string,
  origenAddressLine1:string,
  origenAddressLine2:string,
  origenPlaceId:string,
  origenLat:number,
  origenLng:number,
  destinoAddressLine1:string,
  destinoAddressLine2:string,
  destinoPlaceId:string,
  destinoLat:number,
  destinoLng:number,
}

export interface ViajeCalcularResponse{
    tipo:TipoTransporte,
    precio:number,
    tiempoMinutos:number,
    distanciaEnMetros:number,
    url:string
}