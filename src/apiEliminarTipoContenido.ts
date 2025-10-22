import dotenv from 'dotenv';
import type apiEliminarTipoContenidoType = require('./apiEliminarTipoContenido.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const eliminarTipoContenido = async (idTipoContenido: apiEliminarTipoContenidoType.EliminarTipoContenidoParams['idTipoContenido']): Promise<apiEliminarTipoContenidoType.EliminarTipoContenidoResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/DeleteTipoContenido?IdTipoContenido=${idTipoContenido}`;
    
    console.log('=== eliminarTipoContenido ===');
    console.log('URL:', url);
    console.log('ID Tipo Contenido:', idTipoContenido);
    
    const response = await fetchApi(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    console.log('Tipo de contenido eliminado exitosamente');
    return response as apiEliminarTipoContenidoType.EliminarTipoContenidoResponse;
};

export { eliminarTipoContenido };
