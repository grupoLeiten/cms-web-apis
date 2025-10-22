export interface TextoProducto {
    idTexto?: number;
    tipoContenido?: string;
    titulo?: string;
    contenido?: string;
    idioma?: string;
    activo?: boolean;
}

export type GetTextosPorProductoParams = {
    idProductoBase: string | number;
};

export type GetTextosPorProductoResponse = TextoProducto[];
