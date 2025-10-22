import dotenv from 'dotenv';
import type apiOtrosContenidosType = require('./apiOtrosContenidos.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getImagenesOtrosContenidos = async (): Promise<apiOtrosContenidosType.GetImagenesOtrosContenidosResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/GetImagenes/TipoEntidad/OTROS/IdEntidad/0`;
    
    console.log('=== getImagenesOtrosContenidos ===');
    console.log('URL:', url);
    
    try {
        const response = await fetchApi(url);
        
        // Si la respuesta es un array, devolverlo directamente
        if (Array.isArray(response)) {
            console.log('Imágenes de otros contenidos obtenidas:', response.length);
            return response as apiOtrosContenidosType.GetImagenesOtrosContenidosResponse;
        }
        
        console.log('No se encontraron imágenes de otros contenidos');
        return [];
    } catch (error) {
        console.error('Error obteniendo imágenes de otros contenidos:', error);
        throw error;
    }
};

// Función helper para convertir base64 a URL de datos que se puede usar en <img src="">
const getImageDataUrl = (mediaEntity: apiOtrosContenidosType.MediaEntity): string => {
    if (!mediaEntity.rawMedia || !mediaEntity.mimeType) {
        return '';
    }
    
    // Si el base64 ya incluye el prefijo data:image, devolverlo tal cual
    if (mediaEntity.rawMedia.startsWith('data:')) {
        return mediaEntity.rawMedia;
    }
    
    // Si no, construir el data URL completo
    return `data:${mediaEntity.mimeType};base64,${mediaEntity.rawMedia}`;
};

export { getImagenesOtrosContenidos, getImageDataUrl };
