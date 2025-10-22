export interface ImagenMarca {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
}

export interface AgregarImagenMarcaParams {
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
    idEntidad: number | string;
}

export type AgregarImagenMarcaResponse = ImagenMarca;
