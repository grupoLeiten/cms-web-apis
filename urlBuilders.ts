/**
 * Funciones para generar URLs usando el sistema de URLs cortas (/hikoki)
 * Este archivo puede usarse tanto en cliente como en servidor
 */

// Función helper para generar slugs (SEO friendly URLs)
export function slugify(text: string): string {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
        .replace(/[^a-z0-9]+/g, "-")     // Reemplazar espacios/símbolos con guiones
        .replace(/(^-|-$)/g, "");        // Quitar guiones al inicio/final
}

// Genera URLs cortas para el sistema de rutas reducidas
export function buildShortUrlDirect({ 
    idView, 
    idEntity = "", 
    utmString = "", 
    nombre = "" 
}: {
    idView: string;
    idEntity?: string;
    utmString?: string;
    nombre?: string;
}): string {
    const slug = slugify(nombre);
    const utm = slugify(utmString);
    
    let url = ``;
    
    if (utm && slug) {
        url += `/${utm}/${slug}`;
    } else if (slug) {
        url += `/${slug}`;
    }

    url += `/?idView=${idView}&idMenu=1`;
    
    if(idEntity) {
        url += `&idEntity=${idEntity}`;
    }
    
    return url;
}

// Configuración de mapeo de dominios a vistas
const DOMAIN_VIEW_CONFIG: Record<string, { idView: string; idMenu: string }> = {
    "hikoki": { idView: "21", idMenu: "1" },
    // Agregar más dominios según sea necesario
};

// Valores por defecto cuando no se reconoce el dominio
const DEFAULT_VIEW_CONFIG = { idView: "44", idMenu: "1" };

/**
 * Obtiene la configuración de vista basada en el dominio
 */
export function getViewConfigByDomain(domain: string): { idView: string; idMenu: string } {
    const domainLower = domain?.toLowerCase() || "";
    
    for (const [key, config] of Object.entries(DOMAIN_VIEW_CONFIG)) {
        if (domainLower.includes(key)) {
            return config;
        }
    }
    
    return DEFAULT_VIEW_CONFIG;
}

/**
 * Genera URL de NotFound usando el sistema de URLs cortas (/hikoki)
 */
export function buildNotFoundUrl({ idView, idMenu }: { idView: string; idMenu: string }): string {
    return `/?idView=${idView}&idMenu=${idMenu}`;
}

/**
 * Genera URL de Login usando el sistema de URLs cortas (/hikoki)
 */
export function buildLoginUrl(): string {
    return `/?idView=60&idMenu=1`;
}

/**
 * Genera URL de Register usando el sistema de URLs cortas (/hikoki)
 */
export function     buildRegisterUrl(): string {
    return `/?idView=61&idMenu=1`;
}

/**
 * Genera URL de recuperación de contraseña usando el sistema de URLs cortas (/hikoki)
 * Mismo formato que buildLoginUrl y buildRegisterUrl
 */
export function buildRecoverPasswordUrl(): string {
    return `/?idView=101&idMenu=1`;
}

/**
 * URL de la página de token de recuperación (vista 102). El email se pasa por sesión.
 */
export function buildRecoverPasswordTokenUrl(): string {
    return `/?idView=102&idMenu=1`;
}

