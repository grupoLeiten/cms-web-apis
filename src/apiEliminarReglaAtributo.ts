import dotenv from 'dotenv';
import type apiEliminarReglaAtributoType = require('./apiEliminarReglaAtributo.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const eliminarReglaValidacionAtributo = async (idReglaValidacion: apiEliminarReglaAtributoType.EliminarReglaValidacionAtributoParams['idReglaValidacion']): Promise<apiEliminarReglaAtributoType.EliminarReglaValidacionAtributoResponse> => {
    const url = `${API_BASE_URL}/Atributos/DeleteReglaValidacionAtributo/IdReglaValidacion/${idReglaValidacion}`;
    
    console.log('=== eliminarReglaValidacionAtributo ===');
    console.log('URL:', url);
    console.log('ID Regla Validación:', idReglaValidacion);
    
    const response = await fetchApi(url, {
        method: 'DELETE'
    });
    
    console.log('Regla de validación eliminada exitosamente');
    return response as apiEliminarReglaAtributoType.EliminarReglaValidacionAtributoResponse;
};

export { eliminarReglaValidacionAtributo };
