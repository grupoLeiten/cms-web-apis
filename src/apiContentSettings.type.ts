export type GetVistaParams = {
    params: { idView: string };
    token : string;
};

export type GetVistaResponse = {
    id: string;
    nombre: string;
    descripcion?: string;
    activa: boolean;
    fechaCreacion: string;
    fechaActualizacion?: string;
};
