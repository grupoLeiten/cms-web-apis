export interface TipoProducto {
    idTipoProducto: number;
    codigo: string;
    nombre: string;
    activo: boolean;
    codigoNombre: string;
}

export type GetTiposProductoResponse = TipoProducto[];
