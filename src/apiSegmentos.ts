import dotenv from 'dotenv';
import type apiSegmentosType = require('./apiSegmentos.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getSegmentos = async (): Promise<apiSegmentosType.GetSegmentosResponse> => {
    const url = `${API_BASE_URL}/Atributos/GetSegmentos`;
    
    console.log('=== getSegmentos ===');
    console.log('URL:', url);
    
    try {
        const response = await fetchApi(url);
        
        if (Array.isArray(response)) {
            console.log('Segmentos obtenidos:', response.length);
            return response as apiSegmentosType.GetSegmentosResponse;
        }
        
        console.log('No se encontraron segmentos');
        return [];
    } catch (error) {
        console.error('Error obteniendo segmentos:', error);
        throw error;
    }
};

export { getSegmentos };
