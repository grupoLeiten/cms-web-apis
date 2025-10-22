import dotenv from 'dotenv';
import type apiEliminarType = require('./apiEliminar.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const eliminar = async ({ params }: apiEliminarType.EliminarParams): Promise<apiEliminarType.EliminarResponse> => {
    const url = `${API_BASE_URL}/Atributos/DeleteAtributo/IdAtributo/${params.id}`;
    
    console.log('=== eliminar ===');
    console.log('URL:', url);
    console.log('ID Atributo:', params.id);
    
    const response = await fetchApi(url, {
        method: 'DELETE'
    });
    
    console.log('Atributo eliminado exitosamente');
    return response as apiEliminarType.EliminarResponse;
};

export { eliminar };
