import dotenv from 'dotenv';
import type apiImagenesMarcaProductoType = require('./apiImagenesMarcaProducto.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getImagenesMarcasProductos = async (idEntidad: apiImagenesMarcaProductoType.GetImagenesMarcasProductosParams['idEntidad']): Promise<apiImagenesMarcaProductoType.GetImagenesMarcasProductosResponse> => {
    console.log('=== getImagenesMarcasProductos INICIO ===');
    console.log('idEntidad:', idEntidad);
    
    const url = `${API_BASE_URL}/ContentSettings/GetImagenes/TipoEntidad/MARPRO/IdEntidad/${idEntidad}`;
    console.log('URL completa:', url);
    
    try {
        const response = await fetchApi(url);
        
        console.log('Response recibido del servidor:', response);
        console.log('Es array?', Array.isArray(response));
        console.log('Cantidad de elementos:', Array.isArray(response) ? response.length : 'N/A');
        
        // Si la respuesta es un array, devolverlo directamente
        if (Array.isArray(response)) {
            console.log('Devolviendo array con', response.length, 'elementos');
            return response as apiImagenesMarcaProductoType.GetImagenesMarcasProductosResponse;
        }
        
        console.log('Response no es array, devolviendo array vacío');
        return [];
    } catch (error) {
        console.error('Error obteniendo imágenes de la marca de producto:', error);
        throw error;
    } finally {
        console.log('=== getImagenesMarcasProductos FIN ===');
    }
};

// Función helper para convertir base64 a URL de datos que se puede usar en <img src="">
const getImageDataUrl = (imagen: apiImagenesMarcaProductoType.ImagenMarcaProductoItem): string => {
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

export { getImagenesMarcasProductos, getImageDataUrl };
