import dotenv from 'dotenv';
import type apiImagenesProductoType = require('./apiImagenesProducto.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getImagenesProductos = async (idEntidad: apiImagenesProductoType.GetImagenesProductosParams['idEntidad']): Promise<apiImagenesProductoType.GetImagenesProductosResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/GetImagenes/TipoEntidad/PROBASE/IdEntidad/${idEntidad}`;
    
    console.log('=== getImagenesProductos ===');
    console.log('URL:', url);
    console.log('ID Entidad:', idEntidad);
    
    try {
        const response = await fetchApi(url);
        
        // Si la respuesta es un array, devolverlo directamente
        if (Array.isArray(response)) {
            console.log('Imágenes obtenidas:', response.length);
            return response as apiImagenesProductoType.GetImagenesProductosResponse;
        }
        
        console.log('No se encontraron imágenes');
        return [];
    } catch (error) {
        console.error('Error obteniendo imágenes del producto:', error);
        throw error;
    }
};

// Función helper para convertir base64 a URL de datos que se puede usar en <img src="">
const getImageDataUrl = (imagen: apiImagenesProductoType.ImagenProducto): string => {
    if (!imagen.rawMedia || !imagen.mimeType) {
        return '';
    }
    
    // Si el base64 ya incluye el prefijo data:image, devolverlo tal cual
    if (imagen.rawMedia.startsWith('data:')) {
        return imagen.rawMedia;
    }
    
    // Si no, construir el data URL completo
    return `data:${imagen.mimeType};base64,${imagen.rawMedia}`;
};

export { getImagenesProductos, getImageDataUrl };
