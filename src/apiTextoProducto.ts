import dotenv from 'dotenv';
import type apiTextoProductoType = require('./apiTextoProducto.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getTextosPorProducto = async (idProductoBase: apiTextoProductoType.GetTextosPorProductoParams['idProductoBase']): Promise<apiTextoProductoType.GetTextosPorProductoResponse> => {
    const url = `${API_BASE_URL}/Productos/GetTextosPorProducto/IdProductobase/${idProductoBase}`;
    
    console.log('=== getTextosPorProducto ===');
    console.log('URL:', url);
    console.log('ID Producto Base:', idProductoBase);
    
    try {
        const response = await fetchApi(url);
        
        console.log('Textos del producto obtenidos:', Array.isArray(response) ? response.length : 'No es array');
        return response as apiTextoProductoType.GetTextosPorProductoResponse;
    } catch (error) {
        console.error('Error obteniendo textos del producto:', error);
        throw error;
    }
};

export { getTextosPorProducto };
