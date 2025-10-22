import dotenv from 'dotenv';
import type apiCategoriaProductoType = require('./apiCategoriaProducto.type');

dotenv.config();

const apiUrl = process.env.API_BASE_URL;

export async function getCategoriasProducto(): Promise<apiCategoriaProductoType.CategoriasProductoResponse> {
    const res = await fetch(`${apiUrl}/Atributos/GetCategoriaProducto`, { 
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (!res.ok) {
        throw new Error('Error al obtener las categorías de producto');
    }
    
    // Verificar si hay contenido antes de parsear JSON
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
        return await res.json();
    }
    
    // Si no hay contenido JSON, devolver un array vacío
    return [];
}
