import dotenv from 'dotenv';
import type apiAtributosType = require('./apiAtributos.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const atributos = async (): Promise<apiAtributosType.AtributosResponse> => {
    const url = `${API_BASE_URL}/Atributos/GetAtributos`;
    
    console.log('=== atributos ===');
    console.log('URL:', url);
    
    const response = await fetchApi(url);
    
    console.log('Response data:', response);
    return response as apiAtributosType.AtributosResponse;
};

const editarAtributo = async (data: apiAtributosType.EditarAtributoParams): Promise<apiAtributosType.EditarAtributoResponse> => {
    const url = `${API_BASE_URL}/Atributos/ActualizarAtributo`;
    
    console.log('=== editarAtributo ===');
    console.log('URL:', url);
    console.log('Data:', data);
    
    const response = await fetchApi(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    console.log('Response data:', response);
    return response as apiAtributosType.EditarAtributoResponse;
};

export { atributos, editarAtributo };
