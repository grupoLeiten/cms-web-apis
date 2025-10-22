import dotenv from 'dotenv';
import type apiImagenesMarcaType = require('./apiImagenesMarca.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getImagenesMarca = async (tipoEntidad: apiImagenesMarcaType.GetImagenesMarcaParams['tipoEntidad'], idEntidad: apiImagenesMarcaType.GetImagenesMarcaParams['idEntidad']): Promise<apiImagenesMarcaType.GetImagenesMarcaResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/GetImagenes/TipoEntidad/${tipoEntidad}/IdEntidad/${idEntidad}`;
    
    console.log('=== getImagenesMarca ===');
    console.log('URL:', url);
    console.log('Tipo Entidad:', tipoEntidad);
    console.log('ID Entidad:', idEntidad);
    
    const response = await fetchApi(url);
    
    if (Array.isArray(response)) {
        console.log('Imágenes de marca obtenidas:', response.length);
        return response as apiImagenesMarcaType.GetImagenesMarcaResponse;
    }
    
    console.log('No se encontraron imágenes de marca');
    return [];
};

export { getImagenesMarca };
