import dotenv from 'dotenv';
import type apiImportarProductosType = require('./apiImportarProductos.type');

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const importarAtributosPorProducto = async (file: apiImportarProductosType.ImportarAtributosPorProductoParams['file']): Promise<apiImportarProductosType.ImportarAtributosPorProductoResponse> => {
    try {
        console.log('Iniciando importación con archivo:', file.name, 'Tamaño:', file.size, 'Tipo:', file.type);
        
        // Crear FormData para enviar el archivo
        const formData = new FormData();
        // El servidor espera el parámetro llamado "archivo"
        formData.append('archivo', file);

        const url = `${API_BASE_URL}/Productos/ImportarAtributosPorProducto`;
        console.log('Enviando request a:', url);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            // No establecer Content-Type manualmente, el navegador lo hará automáticamente con el boundary correcto para FormData
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            // Intentar obtener el mensaje de error del servidor
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.text();
                console.log('Error response body:', errorData);
                errorMessage = errorData || errorMessage;
            } catch (e) {
                console.log('No se pudo obtener el cuerpo del error');
            }
            throw new Error(errorMessage);
        }

        // Manejar diferentes tipos de respuesta
        let responseData;
        const contentType = response.headers.get('content-type') || '';
        
        console.log('Content-Type:', contentType);
        
        if (contentType.includes('application/json')) {
            responseData = await response.json();
            console.log('Respuesta JSON:', responseData);
        } else if (contentType.includes('text/')) {
            responseData = await response.text();
            console.log('Respuesta texto:', responseData);
        } else {
            // Para otros tipos de contenido, obtener como blob
            responseData = await response.blob();
            console.log('Respuesta blob, tamaño:', responseData.size);
        }

        return {
            success: true,
            data: responseData,
            message: 'Importación exitosa'
        };
    } catch (error) {
        console.error('Error importando atributos por producto:', error);
        
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error desconocido'
        };
    }
};

export { importarAtributosPorProducto };
