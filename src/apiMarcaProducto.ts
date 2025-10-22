import dotenv from 'dotenv';
import type apiMarcaProductoType = require('./apiMarcaProducto.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getMarcasProducto = async (): Promise<apiMarcaProductoType.GetMarcasProductoResponse> => {
    const url = `${API_BASE_URL}/Atributos/GetMarcas`;
    
    console.log('=== getMarcasProducto ===');
    console.log('URL:', url);
    
    const response = await fetchApi(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    console.log('Marcas de producto obtenidas:', Array.isArray(response) ? response.length : 'No es array');
    return response as apiMarcaProductoType.GetMarcasProductoResponse;
};

export { getMarcasProducto };
