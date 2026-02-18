import { ROUTE_TEMPLATE_CONFIG } from "~/config/routeTemplateConfig";
import { getVista } from "./apiContentSettings.server";

// Re-exportar funciones de URL para compatibilidad con imports existentes
export { 
    getViewConfigByDomain, 
    buildNotFoundUrl, 
    buildLoginUrl, 
    buildRegisterUrl,
    buildRecoverPasswordUrl,
    buildRecoverPasswordTokenUrl
} from "./urlBuilders";

export const getDirectLink = async ({ request, idView, idMenu, token, idEntity = "" }: any) => {
    const result = await getVista({ params: { idView }, token });
    const { templateName } = result.vistaData;

    // const route =  `${ROUTE_TEMPLATE_CONFIG[templateName as keyof typeof ROUTE_TEMPLATE_CONFIG]({ idView, idMenu, idEntity, search: {}, modo: "/simulable" })}`;
    // return route;
    return buildShortUrlDirect({ idView, idEntity});
}

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
// Formato: /simulable/{idView}/{idEntity}/{utm?}/{slug?}
export function buildShortUrlDirect({ 
    idView, 
    idEntity = "", 
    utmString = "", 
    nombre = "",
    search = ""
}: {
    idView: string;
    idEntity?: string;
    utmString?: string;
    nombre?: string;
    search?: string;
}): string {
    // Para vistas sin producto: /simulable/{idView}
    // if (!idEntity) {
    //     return `/simulable/${idView}`;
    // }
    
    // Para productos: /simulable/{idView}/{idEntity}/{utm?}/{slug?}
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

    if(search) {
        url += `&${search}`;
    }
    
    return url;
}
