import dotenv from 'dotenv';
import type apiTipoProductosType = require('./apiTipoProductos.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getTiposProducto = async (): Promise<apiTipoProductosType.GetTiposProductoResponse> => {
    const url = `${API_BASE_URL}/Atributos/GetTiposProducto`;
    
    console.log('=== getTiposProducto ===');
    console.log('URL:', url);
    
    const response = await fetchApi(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    console.log('Tipos de producto obtenidos:', Array.isArray(response) ? response.length : 'No es array');
    return response as apiTipoProductosType.GetTiposProductoResponse;
};

export { getTiposProducto };
