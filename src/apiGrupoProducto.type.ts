export interface GrupoProducto {
    idGrupoProducto: number;
    codigo: string;
    nombre: string;
    activo: boolean;
    codigoNombre: string;
}

export type GetGruposProductoResponse = GrupoProducto[];
