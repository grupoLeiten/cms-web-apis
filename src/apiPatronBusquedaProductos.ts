import dotenv from 'dotenv';
import type apiPatronBusquedaProductosType = require('./apiPatronBusquedaProductos.type');
import { fetchApi } from './api.js';

dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;

const getProductosPorBusqueda = async (patronBusqueda: apiPatronBusquedaProductosType.GetProductosPorBusquedaParams['patronBusqueda']): Promise<apiPatronBusquedaProductosType.GetProductosPorBusquedaResponse> => {
    try {
        const patron = patronBusqueda.trim() === "" ? "*" : patronBusqueda;
        const url = `${API_BASE_URL}/Productos/GetProductosBasePorBusquedaAmbigua/PatronBusqueda/${encodeURIComponent(patron)}`;
        
        console.log('=== getProductosPorBusqueda ===');
        console.log('URL:', url);
        console.log('Patrón de búsqueda:', patron);
        
        const response = await fetchApi(url);
        
        console.log('Productos encontrados:', Array.isArray(response) ? response.length : 'No es array');
        return response as apiPatronBusquedaProductosType.GetProductosPorBusquedaResponse;
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        throw error;
    }
};

// Función para traer TODOS los productos combinando múltiples búsquedas
const getAllProductos = async (): Promise<apiPatronBusquedaProductosType.GetAllProductosResponse> => {
    try {
        console.log('=== BUSCANDO TODOS LOS PRODUCTOS ===');
        
        // Hacer múltiples búsquedas con diferentes patrones para obtener más productos
        const patrones = [
            "*",           // Comodín general
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
        ];
        
        const todasLasPromesas = patrones.map(patron => getProductosPorBusqueda(patron));
        const resultados = await Promise.all(todasLasPromesas);
        
        // Combinar todos los resultados y eliminar duplicados
        const productosUnicos = new Map<number, apiPatronBusquedaProductosType.ProductoBase>();
        
        resultados.forEach(productos => {
            if (Array.isArray(productos)) {
                productos.forEach(producto => {
                    if (producto.idProductoBase) {
                        productosUnicos.set(producto.idProductoBase, producto);
                    }
                });
            }
        });
        
        const productosFinales = Array.from(productosUnicos.values());
        console.log(`Total productos únicos encontrados: ${productosFinales.length}`);
        console.log('=============================');
        
        return productosFinales as apiPatronBusquedaProductosType.GetAllProductosResponse;
    } catch (error) {
        console.error('Error obteniendo todos los productos:', error);
        throw error;
    }
};

export { getProductosPorBusqueda, getAllProductos };
