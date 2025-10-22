import dotenv from 'dotenv';
import type apiGrupoProductoType = require('./apiGrupoProducto.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getGruposProducto = async (): Promise<apiGrupoProductoType.GetGruposProductoResponse> => {
    const url = `${API_BASE_URL}/Atributos/GetGruposProductos`;
    
    console.log('=== getGruposProducto ===');
    console.log('URL:', url);
    
    const response = await fetchApi(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    console.log('Grupos de producto obtenidos:', Array.isArray(response) ? response.length : 'No es array');
    return response as apiGrupoProductoType.GetGruposProductoResponse;
};

export { getGruposProducto };
