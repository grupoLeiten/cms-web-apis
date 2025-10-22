export interface ImagenSegmento {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
}

export interface AgregarImagenSegmentoParams {
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
    idEntidad: number | string;
}

export type AgregarImagenSegmentoResponse = ImagenSegmento;
