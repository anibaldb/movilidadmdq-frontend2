export interface Tarifa{
    id:number,
    tipoTransporte:TipoTransporte,
    bajadaBanderaDia:number,
    bajadaBanderaNoche:number,
    valorFichaDia:number,
    valorFichaNoche:number,
    metrosPorFicha:number,
    ultimaActualizacion:string
}

export type TipoTransporte = 'TAXI' | 'UBER' | 'DIDI'
export type TarifaActualizar = Pick<Tarifa, 'bajadaBanderaDia' | 'bajadaBanderaNoche' | 'valorFichaDia' | 'valorFichaNoche' | 'metrosPorFicha'>