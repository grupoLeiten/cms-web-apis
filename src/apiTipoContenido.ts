import dotenv from 'dotenv';
import type apiTipoContenidoType = require('./apiTipoContenido.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const actualizarTipoContenido = async (data: apiTipoContenidoType.ActualizarTipoContenidoParams): Promise<apiTipoContenidoType.ActualizarTipoContenidoResponse> => {
    const url = `${API_BASE_URL}/ContentSettings/SetTipoContenido`;
    const response = await fetchApi(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response as apiTipoContenidoType.ActualizarTipoContenidoResponse;
};

export { actualizarTipoContenido };
