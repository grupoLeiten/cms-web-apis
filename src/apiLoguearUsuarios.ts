import dotenv from 'dotenv';
import type apiLoguearUsuariosType = require('./apiLoguearUsuarios.type');

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const loguearUsuario = async (data: apiLoguearUsuariosType.LoguearUsuarioParams): Promise<apiLoguearUsuariosType.LoguearUsuarioResponse> => {
    const url = `${API_BASE_URL}/Contexto/Contexto/Login`;
    
    console.log('=== loguearUsuario ===');
    console.log('URL:', url);
    console.log('Usuario:', data.codUsr);
    console.log('Login Anónimo:', data.loginAnonimo);
    
    try {
        const requestBody = {
            codUsr: data.codUsr,
            passWord: data.passWord,
            loginAnonimo: data.loginAnonimo
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            let errorBody;
            try {
                errorBody = await response.text();
                const errorMessage = JSON.parse(errorBody).message || response.statusText;
                throw new Error(errorMessage);
            } catch (e) {
                if (e instanceof Error && e.message !== response.statusText) {
                    throw e;
                }
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        }

        const result = await response.json();
        console.log('Login exitoso:', result.success);
        return result as apiLoguearUsuariosType.LoguearUsuarioResponse;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};

export { loguearUsuario };
