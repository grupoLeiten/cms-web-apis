export interface MediaEntity {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string; // Base64 encoded image
}

export type GetImagenesOtrosContenidosResponse = MediaEntity[];
