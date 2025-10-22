import dotenv from 'dotenv';
import type apiImagenType = require('./apiImagenGrupoProducto.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const agregarImagenGrupoProducto = async (data: apiImagenType.AgregarImagenGrupoProductoParams): Promise<apiImagenType.AgregarImagenGrupoProductoResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/SetImagen?TipoEntidad=GRUPRO&IdEntitidad=${data.idEntidad}`;
    
    const body = {
        idMediaEntity: 0,
        nombre: data.nombre,
        tipoContenido: data.tipoContenido,
        mimeType: data.mimeType,
        rawMedia: data.rawMedia,
        rowVersion: ""
    };
    
    console.log('=== agregarImagenGrupoProducto ===');
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
    return response as apiImagenType.AgregarImagenGrupoProductoResponse;
};

export { agregarImagenGrupoProducto };