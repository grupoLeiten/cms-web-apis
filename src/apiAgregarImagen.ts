import dotenv from 'dotenv';
import type apiAgregarImagenType = require('./apiAgregarImagen.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const agregarImagen = async (data: apiAgregarImagenType.AgregarImagenParams): Promise<apiAgregarImagenType.AgregarImagenResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/SetImagen?TipoEntidad=${data.tipoEntidad}${data.idEntidad ? `&IdEntidad=${data.idEntidad}` : ''}`;
    
    const body = {
        idMediaEntity: 0, // 0 para nueva imagen
        nombre: data.nombre,
        tipoContenido: data.tipoContenido,
        mimeType: data.mimeType,
        rawMedia: data.rawMedia,
        rowVersion: "" // Vacío para nueva imagen
    };
    
    console.log('=== agregarImagen ===');
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
    return response as apiAgregarImagenType.AgregarImagenResponse;
};

export { agregarImagen };
