import dotenv from 'dotenv';
import type apiContentSettingsType = require('./apiContentSettings.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getVista = async ({params} : apiContentSettingsType.GetVistaParams) : Promise<apiContentSettingsType.GetVistaResponse> => {
    const { idView } = params;
    const url = `${API_BASE_URL}/ContentSettings/ContentSettings/GetVista/IdVista/${idView}`;
    const response = await fetchApi(url);
    return response as apiContentSettingsType.GetVistaResponse;
};

export { getVista };