import dotenv from 'dotenv';
import type apiMotorizacionesProductosType = require('./apiMotorizacionesProductos.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getMotorizacionesProducto = async (): Promise<apiMotorizacionesProductosType.GetMotorizacionesProductoResponse> => {
    const url = `${API_BASE_URL}/Atributos/GetMotorizacionesProductos`;
    
    console.log('=== getMotorizacionesProducto ===');
    console.log('URL:', url);
    
    const response = await fetchApi(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    console.log('Motorizaciones de producto obtenidas:', Array.isArray(response) ? response.length : 'No es array');
    return response as apiMotorizacionesProductosType.GetMotorizacionesProductoResponse;
};

export { getMotorizacionesProducto };
