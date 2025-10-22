export interface ImagenGrupoProducto {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
}

export interface AgregarImagenGrupoProductoParams {
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
    idEntidad: number | string;
}

export type AgregarImagenGrupoProductoResponse = ImagenGrupoProducto;

