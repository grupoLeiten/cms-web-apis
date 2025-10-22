export interface Segmento {
    idSegmento: number;
    codigo: string;
    nombre: string;
    activo: boolean;
    codigoNombre: string;
}

export type GetSegmentosResponse = Segmento[];
