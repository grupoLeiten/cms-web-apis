export type ActualizarReglaValidacionAtributoParams = {
    idAtributo: string;
    reglaValidacion: {
        tipo: 'requerido' | 'longitud' | 'formato' | 'rango' | 'personalizado';
        valor?: string | number;
        mensaje?: string;
        activa: boolean;
    };
};

export type ActualizarReglaValidacionAtributoResponse = {
    success: boolean;
    idAtributo?: string;
    reglaValidacion?: {
        id: string;
        tipo: string;
        valor?: string | number;
        mensaje?: string;
        activa: boolean;
    };
    message?: string;
};
