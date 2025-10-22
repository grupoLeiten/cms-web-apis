export interface Atributo {
    id: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion?: string;
}

export type AtributosResponse = Atributo[];

export interface EditarAtributoParams {
    id: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
}

export interface EditarAtributoResponse {
    success: boolean;
    message?: string;
    data?: Atributo;
}
