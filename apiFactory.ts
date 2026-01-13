import configTemplateApis from "~/pages/HomePage/configTemplateComponent.server";
import { getCentrosOperaciones } from "./apiCentrosOperaciones";
import { 
    getContenidoFichaSucursalItem, 
    getMenuGrid,
    postCarruselConfig,
    getBannersVista,
    getVideosVista,
    getItems,
    getContenidoFichaItem,
    getParametros,
    getAtributosCMS,
    getListaDeObjetos,
    getMenu,
    getUrlDirectOnGoToHome,
    getStyleLayoutData,
    getDetailProductData
} from "./apiContentSettings.server";
import { getUserSession } from "~/servicies/userSession";

// const templateApiConfig = {
//     footer : [
//         getCentrosOperaciones,
//         getContenidoFichaSucursalItem,
//         getMenuGrid
//     ],
//     HomePageComponent: [
//         getParametros,        // Para obtener onSearchResultAction
//         getListaDeObjetos,    // Para obtener listaDeObjetos
//         getCentrosOperaciones,// Para obtener DataSucursales
//         getMenu,              // Para obtener dataMenu
//         getUrlDirectOnGoToHome,// Para obtener onGoToHomeAction
//         getUserSession,
//         getCentrosOperaciones,
//         getContenidoFichaSucursalItem,
//         getMenuGrid,        // Para obtener userData
//         getBannersVista,
//         getVideosVista,
//         getItems,
//         getContenidoFichaItem,
//         getStyleLayoutData
//     ],
//     detailProduct: [
//         getDetailProductData  // Encapsula toda la lógica de detalle de producto + redirección
//     ],
//     listFilterProduct: [
//         getItems,             // Para obtener products (filtros del URL automáticos)
//         getContenidoFichaItem,// Para obtener dataHtml
//         getAtributosCMS       // Para obtener dataAtributos (filtros del URL automáticos)
//     ],
//     header: [
//         getParametros,        // Para obtener onSearchResultAction
//         getListaDeObjetos,    // Para obtener listaDeObjetos
//         getCentrosOperaciones,// Para obtener DataSucursales
//         getMenu,              // Para obtener dataMenu
//         getUrlDirectOnGoToHome,// Para obtener onGoToHomeAction
//         getUserSession        // Para obtener userData
//     ],
//     styleLayout: [
//         getStyleLayoutData    // Encapsula toda la lógica de estilos
//     ],
//     //AGREGAR MAS SECCIONES
// }

/**
 * Tipo para las funciones API que reciben un objeto y devuelven un objeto
 * Usa any para aceptar diferentes firmas de funciones API
 */
type ApiFunction = (...args: any[]) => Promise<Record<string, any>>;

/**
 * Tipo para la configuración de APIs agrupadas por sección
 */
type TemplateApiConfig = {
    [key: string]: ApiFunction[];
};

/**
 * Ejecuta todas las APIs de una sección específica y acumula los resultados
 * 
 * @param apiFunctions - Array de funciones API a ejecutar
 * @param objetoLoader - Objeto con token, params y request
 * @returns Objeto con todos los resultados acumulados
 */
async function executeApiSection(
    apiFunctions: ApiFunction[],
    objetoLoader: { token: string; params?: any; request?: Request }
): Promise<Record<string, any>> {
    // Ejecutar todas las APIs en paralelo
    // Pasamos el objetoLoader completo, cada función tomará lo que necesite
    const results = await Promise.all(
        apiFunctions.map(apiFunction => apiFunction(objetoLoader as any))
    );

    // Acumular todos los resultados en un solo objeto
    const accumulatedResult: Record<string, any> = {};
    
    results.forEach(result => {
        Object.assign(accumulatedResult, result);
    });

    return accumulatedResult;
}

/**
 * Ejecuta todas las APIs configuradas en templateApiConfig y acumula los resultados
 * 
 * @param objetoLoader - Objeto con token, params y request necesarios para las APIs
 * @param config - Configuración de APIs (por defecto usa templateApiConfig)
 * @returns Objeto con todos los resultados acumulados, agrupados por sección
 * 
 * @example
 * ```ts
 * const resultado = await executeAllApis({ token, params, request });
 * // resultado = {
 * //   footer: { DataSucursales: [...], centroDeOperacionHtml: [...], menuGridData: [...] }
 * // }
 * ```
 */
export async function executeAllApis(
    objetoLoader: { token: string; params?: any; request?: Request },
    config: TemplateApiConfig = configTemplateApis
): Promise<Record<string, Record<string, any>>> {
    const results: Record<string, Record<string, any>> = {};

    // Recorrer cada sección del config (footer, header, etc.)
    for (const [sectionName, apiFunctions] of Object.entries(config)) {
        // Ejecutar todas las APIs de esta sección y acumular resultados
        results[sectionName] = await executeApiSection(apiFunctions, objetoLoader);
    }

    return results;
}

/**
 * Ejecuta solo las APIs de una sección específica
 * 
 * @param partName - Nombre de la sección a ejecutar (ej: "footer")
 * @param objetoLoader - Objeto con token, params y request
 * @param config - Configuración de APIs (por defecto usa templateApiConfig)
 * @returns Objeto con todos los resultados acumulados de esa sección
 * 
 * @example
 * ```ts
 * const resultado = await executeSectionApis("footer", { token, params, request });
 * // resultado = { DataSucursales: [...], centroDeOperacionHtml: [...], menuGridData: [...] }
 * ```
 */
export async function executeSectionApis(
    partName: string,
    objetoLoader: { token: string; params?: any; request?: Request },
    config: TemplateApiConfig = configTemplateApis
): Promise<Record<string, any>> {
    const apiFunctions = config[partName];
    
    if (!apiFunctions || !Array.isArray(apiFunctions)) {
        throw new Error(`No se encontró la sección "${partName}" en la configuración de APIs`);
    }

    return executeApiSection(apiFunctions, objetoLoader);
}

// Exportar el templateApiConfig por si se necesita acceder directamente
export { templateApiConfig };