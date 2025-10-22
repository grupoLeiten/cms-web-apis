export interface ImagenMarcaProductoItem {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string; // Base64 encoded image
}

export type GetImagenesMarcasProductosParams = {
    idEntidad: string | number;
};

export type GetImagenesMarcasProductosResponse = ImagenMarcaProductoItem[];
