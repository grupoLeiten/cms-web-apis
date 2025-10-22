import dotenv from 'dotenv';
import type apiTipoArchivoType = require('./apiTipoArchivo.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getTiposArchivo = async (): Promise<apiTipoArchivoType.GetTiposArchivoResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/GetMimeTypes`;
    
    console.log('=== getTiposArchivo ===');
    console.log('URL:', url);
    
    try {
        const response = await fetchApi(url);
        
        console.log('Tipos de archivo obtenidos:', Array.isArray(response) ? response.length : 'No es array');
        return response as apiTipoArchivoType.GetTiposArchivoResponse;
    } catch (error) {
        console.error('No se pudo obtener los tipos de archivo:', error);
        throw error;
    }
};

export { getTiposArchivo };
