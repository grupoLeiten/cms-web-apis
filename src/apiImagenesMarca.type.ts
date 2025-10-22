export interface ImagenMarcaItem {
    idMediaEntity: number;
    nombre: string;
    tipoContenido: string;
    mimeType: string;
    rawMedia: string;
}

export type GetImagenesMarcaParams = {
    tipoEntidad: string;
    idEntidad: string | number;
};

export type GetImagenesMarcaResponse = ImagenMarcaItem[];
