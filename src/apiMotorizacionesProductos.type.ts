export interface MotorizacionProducto {
    idMotorizacionProducto?: number;
    codigo?: string;
    nombre?: string;
    activo?: boolean;
    codigoNombre?: string;
}

export type GetMotorizacionesProductoResponse = MotorizacionProducto[];
