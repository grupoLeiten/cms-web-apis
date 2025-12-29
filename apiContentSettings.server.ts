import { API_ENDPOINTS_CONTENT_SETTEINGS, API_ENDPOINTS_PRODUCTOS, API_SERVICE_IMAGE_URL } from "~/cms-web-apis/apiConfig";
import { TIPO_CONTENIDO_CONFIG } from "../cms-web-components/config/tipoContenidoConfig";
import { getDirectLink } from "./utils";

export const getVista = async ({ params, token }: { params: any, token: string }) => {

    const { idView } = params;

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_VISTA}/IdVista/${idView}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );

    const vistasData = await response.json();
    return vistasData;
}


export const getListaDeObjetos = async ({ idView, token }: { idView: string, token: string }) => {

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.LISTA_DE_OBJETOS}?IdVista=${idView}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );
    const data = await response.json();
    return data.ListaDeObjetos;
}
export const getItemsBySearchView = async ({ params, token, searchProduct }: { params: any, token: string, searchProduct: string }) => {
    const { idView } = params;

    const url = `${API_ENDPOINTS_CONTENT_SETTEINGS.GET_ITEMS_BY_SEARCH_VIEW}/IdVista/${idView}/PatronBusqueda/${searchProduct}`;

    const response = await fetch(url,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );

    const text = await response.text();

    // Intentar parsear
    let itemsData;
    try {
        itemsData = JSON.parse(text);
    } catch (error) {
        itemsData = [];
    }

    // Si no hay items, retornar array vacío
    const itemsArray = Array.isArray(itemsData) ? itemsData : (itemsData?.data || []);
    if (itemsArray.length === 0) {
        return itemsArray;
    }

    // Obtener imágenes para cada item usando idVista=22 y tipoContenido=0
    const idVistaBusqueda = "22";
    const idTipoContenido = "0"; // Tipo de contenido 0 por defecto

    const itemsWithImages = await Promise.all(
        itemsArray.map(async (item: any) => {
            const itemId = item.id || item.Id || item.idEntity;
            if (!itemId) {
                return { ...item, image: null };
            }

            try {
                // Llamar directamente al endpoint de imágenes con tipoContenido=0
                const imageResponse = await fetch(
                    `${API_ENDPOINTS_CONTENT_SETTEINGS.IMAGE}/Id/${itemId}/TipoContenido/${idTipoContenido}/IdVista/${idVistaBusqueda}`,
                    {
                        method: "GET",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token
                        }
                    }
                );

                if (!imageResponse.ok) {
                    return { ...item, image: null };
                }

                const imageBlob = await imageResponse.blob();
                const imageArrayBuffer = await imageBlob.arrayBuffer();
                const imageBase64 = btoa(
                    new Uint8Array(imageArrayBuffer)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                const image = `data:image/jpeg;base64,${imageBase64}`;

                return { ...item, image };
            } catch (error) {
                return { ...item, image: null };
            }
        })
    );

    return itemsWithImages;
}

export const getVistas = async ({ token }: { token: string }) => {

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_VISTAS}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );




    const vistasData = await response.json();

    return vistasData;
}

export const getActionVista = async ({ params, token }: { params: any, token: string }) => {

    const { idView } = params;



    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_VISTA}/IdVista/${idView}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );


    const vistasData = await response.json();

    return vistasData.action;
}

export const getParametros = async ({ params, token }: { params: any, token: string }) => {

    const { idView } = params;

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_VISTA}/IdVista/${idView}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );

    if (!response.ok) {
        return { success: false, message: "Error al obtener los parámetros - " + response.statusText };
    }

    const vistasData = await response.json();

    const noImageDefault = vistasData.noImageDefault ? await getImage({ id: vistasData.noImageDefault, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenGrande, noImageDefault: "", idView: idView, token }) : null;



    return {
        action: vistasData.action,
        noImageDefault: noImageDefault,
        onGoToHomeAction: vistasData.onGotoHomeAction,
        onGoToSearchAction: vistasData.onSearchResultAction
    };
}


export const getVistaTemplateName = async ({ params, token }: { params: any, token: string }) => {

    const { idView } = params;


    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_VISTA}/IdVista/${idView}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );




    const vistasData = await response.json();

    return vistasData.templateName;
}

export const getMenuGrid = async ({ params, token }: { params: any, token: string }) => {

    const { idView, idMenu } = params;
    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.MENU_GRID}/IdVista/${idView}/IdMenu/${idMenu}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );

    const data = await response.json();

    return data;

}

export const getMenu = async ({ request, params, token }: { request: Request, params: any, token: string }) => {

    const { idView, idMenu } = params;

    // Validar que idMenu esté presente
    if (!idMenu) {
        return {
            title: "",
            menus: [],
            multimedia: false,
            chip: { textoToHome: "", actionHome: "" }
        };
    }

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.MENU}/IdVista/${idView}/IdMenu/${idMenu}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );

    const menus = await response.json();

    // Validar que la respuesta tenga la estructura esperada
    if (!menus || !menus.menuItems || !Array.isArray(menus.menuItems)) {
        return {
            title: menus?.title || "",
            menus: [],
            multimedia: menus?.menuContieneImagenes || false,
            chip: { textoToHome: menus?.textoToHome || "", actionHome: menus?.actionHome || "" }
        };
    }

    const title = menus.title;
    const multimedia = menus.menuContieneImagenes;

    const menuItems = await Promise.all(menus.menuItems.map(async (item: any) => {
        // Validar que item.menuItems exista y sea un array
        const subItems = item.menuItems && Array.isArray(item.menuItems)
            ? await Promise.all(item.menuItems.map(async (subItem: any) => {
                // TODO: Implement return object for subItem if needed
                const isView = subItem.action ? subItem.action.toLowerCase().startsWith("vista") : "";
                const idView = subItem.action ? subItem.action.split(":")[1] : "";

                return {
                    ...subItem,
                    image: multimedia && idView ? await getImage({ id: subItem.id, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: idView, token }) : null,
                    urlDirect: isView && idView ? await getDirectLink({ request, idView, idMenu: "1", token }) : ""
                };
            }))
            : [];

        const isView = item.action ? item.action.toLowerCase().startsWith("vista") : "";
        const idView = item.action ? item.action.split(":")[1] : "";

        return {
            ...item,
            menuItems: subItems,
            urlDirect: isView && idView ? await getDirectLink({ request, idView, idMenu: "1", token }) : ""
        };
    }));

    return { title, menus: menuItems, multimedia, chip: { textoToHome: menus.textoToHome || "", actionHome: menus.actionHome || "" } };
}


export const getTiposContenido1 = async ({ token }: { token: string }) => {

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_TIPOS_CONTENIDO1}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });

    return response.json();

}

const cache = new Map();


const _getIdTipoContenido = async (tipo: string, token: string) => {


    const data = await getTiposContenido1({ token });

    // Asegurarse de que data sea un array
    const dataArray = Array.isArray(data) ? data : (data?.data || data?.tiposContenido || []);

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        throw new Error(`No se encontraron tipos de contenido o la respuesta no es válida`);
    }

    const TipoContenido = dataArray.find((item: any) => {
        return item.nombre === tipo;
    });

    if (!TipoContenido) {
        throw new Error(`No se encontró el tipo de contenido: ${tipo}`);
    }

    cache.set("tipo", TipoContenido.idTipoContenido);

    return TipoContenido.idTipoContenido;
}

export const getImage = async ({
    id,
    tipoContenido,
    noImageDefault,
    idView,
    token
}: {
    id: string,
    tipoContenido: string,
    noImageDefault: string | null,
    idView: string,
    token: string
}) => {

    const idTipoContenido = await _getIdTipoContenido(tipoContenido, token);
    return `${API_SERVICE_IMAGE_URL}/imagen/${id}/${idTipoContenido}`;
}


export const getDefinirProductosaAction = async ({ search, token }: { search: any, token: string }) => {

    const response = await fetch(`${API_ENDPOINTS_PRODUCTOS.SEARCH}/PatronBusqueda/${search}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );


    const productosData = await response.json();
    return productosData;
}

export const getContenidoFichaSucursalItem = async ({ idView, token }: { idView: string; token: string }) => {

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_CONTENIDO_FICHA_SUCURSAL_ITEM}?IdVista=${idView}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );

    if (!response.ok) {
        return [];
    }

    const data = await response.text();
    const json = JSON.parse(data);

    // Asegurar que siempre devuelva un array
    return Array.isArray(json) ? json : [];
}

export const getAtributosCMS = async ({ idView, idMenu, arrayFilterJson, token }: { idView: string; idMenu: string; arrayFilterJson: string; token: string }) => {


    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_ATRIBUTOS_CMS}?IdVista=${idView}&Id=${idMenu}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: arrayFilterJson
        }
    );


    const data = await response.json();
    return data;

}

export const postCarruselConfig = async ({ idVista, token, noImageDefault }: { idVista: string, token: string, noImageDefault: string | null }) => {


    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.POST_CARRUSEL}?IdVista=${idVista}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
    });

    if (!response.ok) {
        return {
            arrows: false,
            activeView: 0,
            automaticViewChange: false,
            automaticViewChangeInterval: 0,
            endless: false,
            pageable: false,
            pagerOverlay: false,
            items: []
        };
    }

    const carruselData = await response.json();

    // Check if Items exists and is an array before mapping
    const items = Array.isArray(carruselData?.Items) ? carruselData.Items : [];

    const responseWithImages = await Promise.all(
        items.map(async (item: any) => {
            const { IdItem } = item;
            const image = await getImage({ id: IdItem, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenBanner, noImageDefault, idView: idVista, token });
            return { ...item, image };
        })
    );


    const carruselDataFix = {
        arrows: carruselData?.Arrows ?? false,
        activeView: carruselData?.ActiveView ?? 0,
        automaticViewChange: carruselData?.AutomaticViewChange ?? false,
        automaticViewChangeInterval: carruselData?.AutomaticViewChangeInterval ?? 0,
        endless: carruselData?.Endless ?? false,
        pageable: carruselData?.Pageable ?? false,
        pagerOverlay: carruselData?.PagerOverlay ?? false,
        items: responseWithImages
    }
    // carruselData.Items = responseWithImages;

    return carruselDataFix;

};


export const getBannersVista = async ({ idVista, token, noImageDefault }: { idVista: string; token: string; noImageDefault: string | null }) => {


    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_BANNER_VISTA}?IdVista=${idVista}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );

    if (!response.ok) {
        return [];
    }


    const { Banners } = await response.json();

    const dataWithImages = await Promise.all(
        Banners.map(async (item: any) => {
            const { Id } = item;
            const img = await getImage({ id: Id, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenBanner, noImageDefault, idView: idVista, token });
            return { ...item, img };
        })
    );

    return dataWithImages;
}


export const getVideosVista = async ({ idVista, token }: { idVista: string; token: string }) => {

    const response = await fetch(
        `${API_ENDPOINTS_CONTENT_SETTEINGS.GET_VIDOES_VISTA}?IdVista=${idVista}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );

    const data = await response.json();

    if (!data.Videos || data.Videos.length === 0) {
        return null;
    }

    // Obtener miniaturas
    const videosDataSrc = await Promise.all(
        data.Videos.map(async (video: any) => {
            const videoIdMatch = video.Id.match(/video\/(\d+)/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;

            if (!videoId) {
                return { src: video.Id, thumbnail: null };
            }

            try {
                const thumbResponse = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
                const thumbData = await thumbResponse.json();
                const thumbnail = thumbData[0].thumbnail_large;

                return {
                    src: video.Id,
                    thumbnail
                };
            } catch (error) {
                console.error(`Error al obtener thumbnail de Vimeo para video ${videoId}:`, error);
                return { src: video.Id, thumbnail: null };
            }
        })
    );


    return videosDataSrc;
};


export const getItems = async (request, action, idView, arrayFilterJson, idSucursal = 0, pagina = 0, ItemsPorPagina = 0, token, noImageDefault) => {



    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_ITEMS}?IdVista=${idView}&IdSucursal=${idSucursal}&nPagina=${pagina}&ItemsPorPagina=${ItemsPorPagina}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(arrayFilterJson)
    });

    const text = await response.text();

    let payload: any;
    try {
        payload = JSON.parse(text);
    } catch {
        payload = [];
    }

    const itemsArray = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload?.items)
                ? payload.items
                : Array.isArray(payload?.Items)
                    ? payload.Items
                    : [];

    if (noImageDefault) {
        noImageDefault = await getImage({ id: noImageDefault, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault, idView, token });
    }

    const isView = action ? action.toLowerCase().startsWith("vista") : "";
    const idViewAction = action.split(":")[1];
    const dataWithImages = await Promise.all(
        itemsArray.map(async (item: any) => {
            const { id } = item;

            const urlDirect = isView ? await getDirectLink({ request, idView: idViewAction, idMenu: "1", token, idEntity: id }) : "";
            const image = await getImage({ id, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault, idView, token });

            return {
                ...item,
                image,
                urlDirect
            };
        })
    );

    return dataWithImages;
}


export const getContenidoFichaItem = async (idView: string, token: string) => {


    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_CONTENIDO_FICHA_ITEM}?IdVista=${idView}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        }
    );

    const data = await response.text();
    const json = JSON.parse(data);
    return json;
}

export const fetchImageById = async ({ id, idView, token }: { id: number, idView: number, token: string }) => {
    return `${API_SERVICE_IMAGE_URL}/imagen/${id}/IdView/${idView}`;
    // const imageResponse = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_IMAGEN_BY_ID_IMAGEN}/Id/${id}/IdVista/${idView}`, {
    //     method: "GET",
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': token
    //     }
    // }
    // );

    // if (!imageResponse.ok) {
    //     return `data:image/png;base64,${DEFAULT_IMAGE_BASE64_STRING}`;
    // }
    // const imageBlob = await imageResponse.blob();
    // const imageArrayBuffer = await imageBlob.arrayBuffer();
    // const imageBase64 = btoa(
    //     new Uint8Array(imageArrayBuffer)
    //         .reduce((data, byte) => data + String.fromCharCode(byte), '')
    // );
    // const image = `data:image/jpeg;base64,${imageBase64}`;

    // return image;

}

export const getFichaProducto = async ({
    idView,
    idProducto,
    token
}: {
    idView: string;
    idProducto: String;
    token: string;
}) => {

    const response = await fetch(
        `${API_ENDPOINTS_CONTENT_SETTEINGS.GET_FICHA_PRODUCTO}?IdVista=${Number(idView)}&IdEntity=${idProducto}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            }
        }
    );

    const data = await response.json();

    // Verificar que galeriaFotos existe y es un array antes de procesarlo
    if (data.galeriaFotos && Array.isArray(data.galeriaFotos)) {
        const imagen: any[] = data.galeriaFotos.map((item: any) => {
            return { ...item, image: `${API_SERVICE_IMAGE_URL}/imagen/${item.idImagen}/IdView/${idView}`, alt: "" };
        });

        data.galeriaFotos = imagen;
    } else {
        // Si no hay galeriaFotos, inicializar como array vacío
        data.galeriaFotos = [];
    }


    if (data?.otrasImagenes1) {
        data.otrasImagenes1 = data.otrasImagenes1.map((imagen: any) => {
            return { image: `${API_SERVICE_IMAGE_URL}/imagen/${imagen}/IdView/${idView}`, alt: "" };
        });
        data.otrasImagenes1 = data.otrasImagenes1;
    }
    if (data?.otrasImagenes2) {
        data.otrasImagenes2 = data.otrasImagenes2.map((imagen: any) => {
            
            return { image: `${API_SERVICE_IMAGE_URL}/imagen/${imagen}/IdView/${idView}`, alt: "" };
        });

    }
    if (data?.otrasImagenes3) {
        data.otrasImagenes3 = data.otrasImagenes3.map((imagen: any) => {
            
            return { image: `${API_SERVICE_IMAGE_URL}/imagen/${imagen}/IdView/${idView}`, alt: "" };
        });

    }


    const itemModelWithImage = await Promise.all(
        data.items.map(async (item: any) => {
            if (item.tipoContenido === "Table") {
                return item;
            }

            const contenidosWithImages = await Promise.all(
                item.contenidos.map(async (subItem: any) => {
                    const image = await getImage({
                        id: subItem.idImagen,
                        tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenGrande,
                        noImageDefault: "",
                        idView,
                        token
                    });
                    const itemBaseModel = { ...subItem.itemBaseModel, image };
                    return { ...subItem, itemBaseModel };
                })
            );
            return { ...item, contenidos: contenidosWithImages };
        })
    );

    data.items = itemModelWithImage;

    const { items, galeriaFotos, tabPositions, carruselModel, itemBaseModel, templateItems, ...others } = data;
    const { itemModel, ...carrouselConfig } = carruselModel;

    const templateNombre = templateItems.find((item: any) => item.Key === "#NOMBRE#");
    const aux1 = templateItems.filter((item: any) => item.Key !== "#NOMBRE#");
    const templateCodigo = templateItems.find((item: any) => item.Key === "#CODIGO#");
    const aux2 = aux1.filter((item: any) => item.Key !== "#CODIGO#");

    return {
        dataCarrusel: {
            ...carrouselConfig,
            items: galeriaFotos
        },
        tabPositions,
        itemModel, 
        nombre: itemBaseModel.nombre,
        codigo: itemBaseModel.codigo,
        items,
        itemBaseModel : {...itemBaseModel, image : galeriaFotos[0].image},
        templateNombre,
        templateCodigo,
        boxItems: aux2,
        othersProps: others
    };
};


// export const getImagenAsDownload = async ({ id, token }: { id: string, token: string }) => {



//     try {
//         const pdfResponse = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_IMAGEN_AS_DOWNLOAD}/Id/${id}`, {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': token
//             }
//         });


//         const pdfBlob = await pdfResponse.blob();
//         const url = URL.createObjectURL(pdfBlob);
//         // Extraer filename del header
//         const contentDisposition = pdfResponse.headers.get("content-disposition");
//         let filename = "archivo";
//         if (contentDisposition) {
//             const match = contentDisposition.match(/filename[^;=\n]*=((['\"]).*?\\2|[^;\n]*)/);
//             if (match && match[1]) {
//                 filename = match[1].replace(/['"]/g, "");
//             }
//         }

//         return { url, filename };
//     } catch (error) {
//         throw new Error("Fallo la conexion.");
//     }
// }


export async function getImagenAsDownload({ id, token }: { id: string, token: string }) {
    const res = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_IMAGEN_AS_DOWNLOAD}/Id/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    });
    if (!res.ok) throw new Error("No se pudo descargar el archivo");

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = res.headers.get("content-disposition") || "attachment";
    const contentLength = res.headers.get("content-length");

    return new Response(Buffer.from(buffer), {
        status: 200,
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": contentDisposition,
            ...(contentLength ? { "Content-Length": contentLength } : {}),
        },
    });
}

export async function getImagenAsPreview({ id, token }: { id: string, token: string }) {
    try {
        const url = `${API_ENDPOINTS_CONTENT_SETTEINGS.GET_IMAGEN_AS_DOWNLOAD}/Id/${id}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        if (!res.ok) {
            const errorText = await res.text().catch(() => '');
            console.error(`Error al obtener PDF preview: ${res.status} ${res.statusText}`, errorText);
            throw new Error(`No se pudo obtener el archivo: ${res.status} ${res.statusText}`);
        }

        const buffer = await res.arrayBuffer();
        // Forzar el Content-Type a application/pdf para que el navegador lo muestre correctamente
        const contentType = "application/pdf";
        const contentLength = res.headers.get("content-length");

        // Usar "inline" en lugar de "attachment" para que el navegador muestre el PDF
        return new Response(Buffer.from(buffer), {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": "inline",
                "X-Content-Type-Options": "nosniff",
                ...(contentLength ? { "Content-Length": contentLength } : {}),
            },
        });
    } catch (error: any) {
        console.error("Error en getImagenAsPreview:", error);
        throw error;
    }
}