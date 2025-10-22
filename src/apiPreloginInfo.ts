import dotenv from 'dotenv';
import type apiPreloginInfoType = require('./apiPreloginInfo.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getPreLoginInfo = async (): Promise<apiPreloginInfoType.GetPreLoginInfoResponse> => {
    const url = `${API_BASE_URL}/Contexto/Contexto/GetPreLoginInfo`;
    
    console.log('=== getPreLoginInfo ===');
    console.log('URL:', url);
    
    try {
        const response = await fetchApi(url);
        
        console.log('Información de pre-login obtenida:', response);
        return response as apiPreloginInfoType.GetPreLoginInfoResponse;
    } catch (error) {
        console.error('Error obteniendo información de pre-login:', error);
        throw error;
    }
};

export { getPreLoginInfo };
