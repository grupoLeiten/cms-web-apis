export interface CategoriaProducto {
    id: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion?: string;
}

export type CategoriasProductoResponse = CategoriaProducto[];
