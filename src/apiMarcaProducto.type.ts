export interface MarcaProducto {
    idMarcaProducto: number;
    codigo: string;
    nombre: string;
    activo: boolean;
    codigoNombre: string;
}

export type GetMarcasProductoResponse = MarcaProducto[];
