import dotenv from 'dotenv';
import type apiImagenesGrupoProductoType = require('./apiImagenesGrupoProducto.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getImagenesGrupoProducto = async (idEntidad: apiImagenesGrupoProductoType.GetImagenesGrupoProductoParams['idEntidad']): Promise<apiImagenesGrupoProductoType.GetImagenesGrupoProductoResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/GetImagenes/TipoEntidad/GRUPRO/IdEntidad/${idEntidad}`;
    
    console.log('=== getImagenesGrupoProducto ===');
    console.log('URL:', url);
    console.log('ID Entidad:', idEntidad);
    
    try {
        const response = await fetchApi(url);
        
        if (Array.isArray(response)) {
            console.log('Imágenes de grupo producto obtenidas:', response.length);
            return response as apiImagenesGrupoProductoType.GetImagenesGrupoProductoResponse;
        }
        
        console.log('No se encontraron imágenes de grupo producto');
        return [];
    } catch (error) {
        console.error('Error obteniendo imágenes del grupo de producto:', error);
        throw error;
    }
};

export { getImagenesGrupoProducto };
