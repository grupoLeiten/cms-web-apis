export interface ProductoBase {
    idProductoBase?: number;
    nombre?: string;
    codigo?: string;
    codigoNombre?: string;
    idEntity?: string;
}

export type GetProductosPorBusquedaParams = {
    patronBusqueda: string;
};

export type GetProductosPorBusquedaResponse = ProductoBase[];

export type GetAllProductosResponse = ProductoBase[];
