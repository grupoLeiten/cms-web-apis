import dotenv from 'dotenv';
import type apiEliminarImagenesType = require('./apiEliminarImagenes.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const eliminarImagen = async (idMediaEntity: apiEliminarImagenesType.EliminarImagenParams['idMediaEntity']): Promise<apiEliminarImagenesType.EliminarImagenResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/DeleteImagen?IdMediaEntity=${idMediaEntity}`;
    
    console.log('=== eliminarImagen ===');
    console.log('URL:', url);
    console.log('ID Media Entity:', idMediaEntity);
    
    await fetchApi(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    console.log('Imagen eliminada exitosamente');
    return;
};

export { eliminarImagen };
