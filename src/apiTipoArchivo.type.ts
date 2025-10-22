export interface TipoArchivo {
    id?: number;
    mimeType?: string;
    extension?: string;
    descripcion?: string;
    activo?: boolean;
}

export type GetTiposArchivoResponse = TipoArchivo[];
