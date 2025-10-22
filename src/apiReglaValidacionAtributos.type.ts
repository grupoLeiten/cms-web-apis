export interface ReglaValidacionAtributo {
    idReglaValidacion?: number;
    idAtributo?: number;
    tipo?: string;
    valor?: string | number;
    mensaje?: string;
    activa?: boolean;
    fechaCreacion?: string;
    fechaActualizacion?: string;
}

export type ReglaValidacionAtributoResponse = ReglaValidacionAtributo[];
