export interface ImagenTipoProducto {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
}

export interface AgregarImagenTipoProductoParams {
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
    idEntidad: number | string;
}

export type AgregarImagenTipoProductoResponse = ImagenTipoProducto;
