export interface MediaEntity {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
}

export interface AgregarImagenParams {
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
    tipoEntidad: string;
    idEntidad?: number | string;
}

export type AgregarImagenResponse = MediaEntity;
