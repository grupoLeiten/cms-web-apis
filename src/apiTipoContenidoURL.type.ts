export interface TipoContenidoURL {
    idTipoContenidoURL?: number;
    nombre?: string;
    descripcion?: string;
    activo?: boolean;
}

export type GetTipoContenidoURLResponse = TipoContenidoURL[];
