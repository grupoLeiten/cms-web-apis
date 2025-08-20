import { API_ENDPOINTS_CONTENT_SETTEINGS, API_ENDPOINTS_PRODUCTOS } from "~/cms-web-apis/apiConfig";
import { DEFAULT_IMAGE_BASE64_STRING } from "~/cms-web-components/config/imageConfig";
import { TIPO_CONTENIDO_CONFIG } from "../cms-web-components/config/tipoContenidoConfig";

export const getVista = async ({ request, params, token }: { request: Request, params: any, token: string }) => {

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

export const getItemsBySearchView = async ({ request, params, token }: { request: Request, params: any, token: string }) => {
    const { idView, searchProduct } = params;

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_ITEMS_BY_SEARCH_VIEW}/IdVista/${idView}/PatronBusqueda/${searchProduct}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );


    

    const itemsData = await response.json();

    return itemsData;
}

export const getVistas = async ({ request, token }: { request: Request, token: string }) => {

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

export const getDefinirProductos = async ({ request, params, token }: { request: Request, params: any, token: string }) => {

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

export const getActionVista = async ({ request, params, token }: { request: Request, params: any, token: string }) => {

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


export const getVistaTemplateName = async ({ request, params, token }: { request: Request, params: any, token: string }) => {

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

export const getMenu = async ({ request, params, token }: { request: Request, params: any, token: string }) => {

    const { idView, idMenu } = params;


    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.MENU}/IdVista/${idView}/IdMenu/${idMenu}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );

    const menus = await response.json();

    const title = menus.title;
    const multimedia = menus.menuContieneImagenes;

    const menuItems = await Promise.all(menus.menuItems.map(async (item: any) => {
        const subItems = await Promise.all(item.menuItems.map(async (subItem: any) => {
            // TODO: Implement return object for subItem if needed
            return {
                ...subItem,
                image: multimedia ? await getImage({ request, id: subItem.id, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault : "", idView: idView, token }) : null,
            };
        }));
        return {
            ...item,
            menuItems: subItems
        };
    }));

    return { title, menus: menuItems, multimedia };
}


export const getTiposContenido1 = async ({ request, token }: { request: Request, token: string }) => {

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_TIPOS_CONTENIDO1}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });

    return response.json();

}

const cache = new Map();


const _getIdTipoContenido = async (request: Request, tipo: string, token: string) => {

    const cached = cache.get("tipo");

    if (cache.has("tipo")) {
        return cache.get("tipo");
    }

    const data = await getTiposContenido1({ request, token });

    const TipoContenido = data.find((item: any) => {

        return item.nombre === tipo;
    }, {});

    cache.set("tipo", TipoContenido.idTipoContenido);

    return TipoContenido.idTipoContenido;
}

export const getImage = async ({ request, id, tipoContenido, noImageDefault, idView, token }: { request: any, id: string, tipoContenido: string, noImageDefault: string, idView: string, token: string }) => {


    const idTipoContenido = await _getIdTipoContenido(request, tipoContenido, token);

    try {
        const imageResponse = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.IMAGE}/Id/${id}/TipoContenido/${idTipoContenido}/IdVista/${idView}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        const imageBlob = await imageResponse.blob();
        const imageArrayBuffer = await imageBlob.arrayBuffer();
        const imageBase64 = btoa(
            new Uint8Array(imageArrayBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        if (!imageResponse.ok) {
            return noImageDefault;
            // return `data:image/png;base64,${DEFAULT_IMAGE_BASE64_STRING}`;
        }
        const image = `data:image/jpeg;base64,${imageBase64}`;
        return image;
    } catch (error) {
        return noImageDefault;

        //        return `data:image/png;base64,${DEFAULT_IMAGE_BASE64_STRING}`;
    }
}


export const getDefinirProductosaAction = async ({ request, search, token }: { request: Request, search: any, token: string }) => {

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

export const getContenidoFichaSucursalItem = async ({ request, idView, token }) => {

    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_CONTENIDO_FICHA_SUCURSAL_ITEM}?IdVista=${idView}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );


    const data = await response.text();
    const json = JSON.parse(data);
    return json;
}

export const getAtributosCMS = async ({ request, idView, idMenu, arrayFilterJson, token }: { request: Request, idView: string, idMenu: string, arrayFilterJson: string, token: string }) => {


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

export const postCarruselConfig = async ({ request, idVista, data, token }: { request: Request, idVista: string, data: any, token: string }) => {


    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.POST_CARRUSEL}?IdVista=${idVista}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(data)

    });


    const carruselData = await response.json();

    const responseWithImages = await Promise.all(
        carruselData.Items.map(async (item: any) => {
            const { IdItem } = item;
            const image = await getImage({ request, id: IdItem, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenBanner, noImageDefault : "", idView: idVista, token });
            return { ...item, image };
        })
    );


    const carruselDataFix = {
        arrows: carruselData.Arrows,
        activeView: carruselData.ActiveView,
        automaticViewChange: carruselData.AutomaticViewChange,
        automaticViewChangeInterval: carruselData.AutomaticViewChangeInterval,
        endless: carruselData.Endless,
        pageable: carruselData.Pageable,
        pagerOverlay: carruselData.PagerOverlay,
        items: responseWithImages
    }
    // carruselData.Items = responseWithImages;

    return carruselDataFix;

};


export const getBannersVista = async ({ request, idVista, token }: { request: Request, idVista: string, token: string }) => {


    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_BANNER_VISTA}?IdVista=${idVista}`,
        {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
    );


    const { Banners } = await response.json();

    const dataWithImages = await Promise.all(
        Banners.map(async (item: any) => {
            const { Id } = item;
            const image = await getImage({ request, id: Id, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenBanner, noImageDefault: "", idView: idVista, token });
            return { ...item, image };
        })
    );

    return dataWithImages;
}


export const getVideosVista = async ({ request, idVista, token }: { request: Request, idVista: string, token: string }) => {

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
                const thumbnail = thumbData[0]?.thumbnail_large;


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


export const getItems = async (request, idView, arrayFilterJson, idSucursal = 0, pagina = 0, ItemsPorPagina = 0, token) => {



    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_ITEMS}?IdVista=${idView}&IdSucursal=${idSucursal}&nPagina=${pagina}&ItemsPorPagina=${ItemsPorPagina}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(arrayFilterJson)
    });

    const data = await response.json();

    const dataVista = await getVista({ request, params: { idView }, token });
    let noImageDefault = `data:image/jpeg;base64,${DEFAULT_IMAGE_BASE64_STRING}`;

    if (dataVista?.noImageDefault) {
        noImageDefault = await getImage({ request, id: dataVista.noImageDefault, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault, idView, token });
    }


    const dataWithImages = await Promise.all(
        data.map(async (item: any) => {
            const { id } = item;
            const image = await getImage({ request, id, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault, idView, token });
            return { ...item, image };
        })
    );

    return dataWithImages;
}


export const getContenidoFichaItem = async (request, idView, token) => {


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

export const fetchImageById = async ({ request, id, idView, token }: { request: Request, id: number, idView: number, token: string }) => {

    const imageResponse = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_IMAGEN_BY_ID_IMAGEN}/Id/${id}/IdVista/${idView}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }
    );

    if (!imageResponse.ok) {
        return `data:image/png;base64,${DEFAULT_IMAGE_BASE64_STRING}`;
    }
    const imageBlob = await imageResponse.blob();
    const imageArrayBuffer = await imageBlob.arrayBuffer();
    const imageBase64 = btoa(
        new Uint8Array(imageArrayBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    const image = `data:image/jpeg;base64,${imageBase64}`;

    return image;

}

export const getFichaProducto = async ({
    request,
    idView,
    idProducto,
    token
}: {
    request: Request;
    idView: string;
    idProducto: String;
    token: string;
}) => {

    const response = await fetch(
        `${API_ENDPOINTS_CONTENT_SETTEINGS.GET_FICHA_PRODUCTO}?IdVista=${idView}&IdEntity=${idProducto}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            }
        }
    );

    const data = await response.json();


    const imagen = await Promise.all(
        data.galeriaFotos.map(async (item: any) => {
            const image = await fetchImageById({ request, id: item.idImagen, idView, token });
            return { ...item, image, alt: "" };
        })
    );
    data.galeriaFotos = imagen;

    const itemModelWithImage = await Promise.all(
        data.items.map(async (item: any) => {
            if (item.tipoContenido === "Table") {
                return item;
            }

            // ✅ DESCARGABLES (PDFs)
            if (item.tipoContenido === "Descargables") {
                const contenidosWithPDF = await Promise.all(
                    item.contenidos.map(async (subItem: any) => {
                        const documento = await getImagenAsDownload({
                            request,
                            id: subItem.idImagen,
                            token
                        });
                        return { ...subItem, documento };
                    })
                );
                return { ...item, contenidos: contenidosWithPDF };
            }

            // ✅ OTROS (con imagen)
            const contenidosWithImages = await Promise.all(
                item.contenidos.map(async (subItem: any) => {
                    const image = await getImage({
                        request,
                        id: subItem.idImagen,
                        tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenGrande,
                        noImageDefault: "",
                        idView,
                        token
                    });
                    return { ...subItem, image };
                })
            );
            return { ...item, contenidos: contenidosWithImages };
        })
    );

    data.items = itemModelWithImage;

    const { items, galeriaFotos, tabPositions, carruselModel, itemBaseModel, templateItems, ...others } = data;
    const { itemModel, ...carrouselConfig } = carruselModel;

    return {
        dataCarrusel: {
            ...carrouselConfig,
            items: galeriaFotos
        },
        tabPositions,
        itemModel,
        title: others.nombre,
        codigo: others.codigo,
        items,
        itemBaseModel,
        templateItems,
        othersProps: others
    };
};


export const getImagenAsDownload = async ({ request, id, token }: { request: Request, id: string, token: string }) => {



    try {
        const pdfResponse = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_IMAGEN_AS_DOWNLOAD}/Id/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });


        const pdfBlob = await pdfResponse.blob();
        const url = URL.createObjectURL(pdfBlob);
        // Extraer filename del header
        const contentDisposition = pdfResponse.headers.get("content-disposition");
        let filename = "archivo";
        if (contentDisposition) {
            const match = contentDisposition.match(/filename[^;=\n]*=((['\"]).*?\\2|[^;\n]*)/);
            if (match && match[1]) {
                filename = match[1].replace(/['"]/g, "");
            }
        }

        return { url, filename };
    } catch (error) {
        throw new Error("Fallo la conexion.");
    }
}
