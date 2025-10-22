import dotenv from 'dotenv';
import type AgregarImagenTipoProductoType = require('./AgregarImagenTipoProducto.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const agregarImagenTipoProducto = async (data: AgregarImagenTipoProductoType.AgregarImagenTipoProductoParams): Promise<AgregarImagenTipoProductoType.AgregarImagenTipoProductoResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/SetImagen?TipoEntidad=TIPPRO&IdEntitidad=${data.idEntidad}`;
    
    const body = {
        idMediaEntity: 0,
        nombre: data.nombre,
        tipoContenido: data.tipoContenido,
        mimeType: data.mimeType,
        rawMedia: data.rawMedia,
        rowVersion: ""
    };
    
    console.log('=== agregarImagenTipoProducto ===');
    console.log('URL:', url);
    console.log('Body:', {
        ...body,
        rawMedia: body.rawMedia.substring(0, 50) + '... (truncado)'
    });
    
    const response = await fetchApi(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    
    console.log('Response data:', response);
    return response as AgregarImagenTipoProductoType.AgregarImagenTipoProductoResponse;
};

export { agregarImagenTipoProducto };
