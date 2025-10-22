export interface ImagenProducto {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string; // Base64 encoded image
}

export type GetImagenesProductosParams = {
    idEntidad: string | number;
};

export type GetImagenesProductosResponse = ImagenProducto[];
