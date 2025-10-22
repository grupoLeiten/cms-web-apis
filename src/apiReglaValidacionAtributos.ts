import dotenv from 'dotenv';
import type apiReglaValidacionAtributosType = require('./apiReglaValidacionAtributos.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const reglaValidacionAtributo = async (): Promise<apiReglaValidacionAtributosType.ReglaValidacionAtributoResponse> => {
    const url = `${API_BASE_URL}/Atributos/GetReglaValidacionAtributos`;
    
    console.log('=== reglaValidacionAtributo ===');
    console.log('URL:', url);
    
    try {
        const response = await fetchApi(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('Reglas de validación de atributos obtenidas:', Array.isArray(response) ? response.length : 'No es array');
        return response as apiReglaValidacionAtributosType.ReglaValidacionAtributoResponse;
    } catch (error) {
        console.error('Error fetching regla validacion atributo:', error);
        throw error;
    }
};

export { reglaValidacionAtributo };
