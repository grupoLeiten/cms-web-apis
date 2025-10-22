import dotenv from 'dotenv';
import type apiReglasValidacionType = require('./apiReglasValidacion.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const actualizarReglaValidacionAtributo = async (data: apiReglasValidacionType.ActualizarReglaValidacionAtributoParams): Promise<apiReglasValidacionType.ActualizarReglaValidacionAtributoResponse> => {
    const url = `${API_BASE_URL}/Atributos/ActualizarReglaValidacionAtributo`;
    const response = await fetchApi(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response as apiReglasValidacionType.ActualizarReglaValidacionAtributoResponse;
};

export { actualizarReglaValidacionAtributo };
