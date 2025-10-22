import dotenv from 'dotenv';
import type apiContextoType = require('./apiContexto.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const GetMainMenu = async (): Promise<apiContextoType.GetMainMenuResponse> => {
    const url = `${API_BASE_URL}/Contexto/Contexto/GetMainMenu`;
    
    console.log('=== GetMainMenu ===');
    console.log('URL:', url);
    
    const response = await fetchApi(url);
    
    console.log('Response data:', response);
    return response as apiContextoType.GetMainMenuResponse;
};

export { GetMainMenu };
