export interface ImagenGrupoProductoItem {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
}

export type GetImagenesGrupoProductoParams = {
    idEntidad: string | number;
};

export type GetImagenesGrupoProductoResponse = ImagenGrupoProductoItem[];
