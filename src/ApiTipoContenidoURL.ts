import dotenv from 'dotenv';
import type apiTipoContenidoURLType = require('./apiTipoContenidoURL.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getTipoContenidoURL = async (): Promise<apiTipoContenidoURLType.GetTipoContenidoURLResponse> => {
    const url = `${API_BASE_URL}/Productos/GetTipoContenidoURL`;
    
    console.log('=== getTipoContenidoURL ===');
    console.log('URL:', url);
    
    try {
        const response = await fetchApi(url);
        
        // Si la respuesta es un array, devolverlo directamente
        if (Array.isArray(response)) {
            console.log('Tipos de contenido URL obtenidos:', response.length);
            return response as apiTipoContenidoURLType.GetTipoContenidoURLResponse;
        }
        
        console.log('No se encontraron tipos de contenido URL');
        return [];
    } catch (error) {
        console.error('Error obteniendo tipos de contenido URL:', error);
        throw error;
    }
};

export { getTipoContenidoURL };
