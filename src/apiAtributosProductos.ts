import dotenv from 'dotenv';
import type apiAtributosProductosType = require('./apiAtributosProductos.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getAtributosPorProducto = async (idProductoBase: apiAtributosProductosType.GetAtributosPorProductoParams['idProductoBase']): Promise<apiAtributosProductosType.GetAtributosPorProductoResponse> => {
    const url = `${API_BASE_URL}/Productos/GetAtributosPorProducto/IdProductobase/${idProductoBase}`;
    
    console.log('=== getAtributosPorProducto ===');
    console.log('URL:', url);
    console.log('ID Producto Base:', idProductoBase);
    
    const response = await fetchApi(url);
    
    console.log('Response data:', response);
    return response as apiAtributosProductosType.GetAtributosPorProductoResponse;
};

export { getAtributosPorProducto };
