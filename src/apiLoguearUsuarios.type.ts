export interface LoginData {
    codUsr: string;
    passWord: string;
    loginAnonimo: boolean;
}

export interface LoginResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: {
        id: number;
        nombre: string;
        email?: string;
    };
}

export type LoguearUsuarioParams = LoginData;

export type LoguearUsuarioResponse = LoginResponse;
