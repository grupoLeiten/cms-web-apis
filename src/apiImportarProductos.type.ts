export interface ImportarAtributosResponse {
    success: boolean;
    data?: any;
    message?: string;
}

export interface ImportarAtributosRequest {
    file: File;
}

export type ImportarAtributosPorProductoParams = {
    file: File;
};

export type ImportarAtributosPorProductoResponse = ImportarAtributosResponse;
