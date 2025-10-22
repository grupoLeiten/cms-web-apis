export interface AtributoProducto {
    idAtributo?: number;
    nombre?: string;
    nombreCorto?: string;
    tipoValor?: string;
    valor?: string;
    valorMinimo?: string;
    valorMaximo?: string;
    unidadMedida?: string;
    activo?: boolean;
}

export interface GetAtributosPorProductoParams {
    idProductoBase: string | number;
}

export type GetAtributosPorProductoResponse = AtributoProducto[];
