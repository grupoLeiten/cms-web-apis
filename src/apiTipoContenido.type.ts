export type ActualizarTipoContenidoParams = {
    id: string;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    configuracion?: {
        campos: string[];
        validaciones?: any;
    };
};

export type ActualizarTipoContenidoResponse = {
    success: boolean;
    id?: string;
    message?: string;
    tipoContenido?: {
        id: string;
        nombre: string;
        descripcion?: string;
        activo: boolean;
        fechaActualizacion: string;
    };
};
