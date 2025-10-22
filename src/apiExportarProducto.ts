import dotenv from 'dotenv';
import type apiExportarProductoType = require('./apiExportarProducto.type');

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const exportarAtributosPorProducto = async (): Promise<apiExportarProductoType.ExportarAtributosPorProductoResponse> => {
    const url = `${API_BASE_URL}/Productos/ExportarAtributosPorProducto`;
    
    console.log('=== exportarAtributosPorProducto ===');
    console.log('URL:', url);
    
    try {
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Obtener el blob del archivo descargado
        const blob = await response.blob();
        
        // Obtener el nombre del archivo desde los headers de la respuesta
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'atributos_productos_exportados';
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }
        
        // Crear URL del blob y descargar automáticamente
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
        console.log('Archivo descargado exitosamente');
        return {
            success: true,
            message: 'Archivo descargado exitosamente'
        };
    } catch (error) {
        console.error('Error exportando atributos por producto:', error);
        
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error desconocido'
        };
    }
};

export { exportarAtributosPorProducto };
