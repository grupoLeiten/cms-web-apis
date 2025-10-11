import { API_ENDPOINTS_CONTENT_SETTEINGS, API_ENDPOINTS_PRODUCTOS } from "~/cms-web-apis/apiConfig";
import { DEFAULT_IMAGE_BASE64_STRING } from "~/cms-web-components/config/imageConfig";
import { TIPO_CONTENIDO_CONFIG } from "../cms-web-components/config/tipoContenidoConfig";

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

export const getDefinirProductos = async ({ params, token }: { params: any, token: string }) => {

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

    const vistasData = await response.json();

    const noImageDefault = vistasData.noImageDefault  ?await getImage({ id: vistasData.noImageDefault, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenGrande, noImageDefault: "", idView: idView, token }) : null;



    return {
        action: vistasData.action,
        noImageDefault: noImageDefault,
        onGoToHomeAction: vistasData.onGoToHomeAction,
        onGoToSearchAction: vistasData.onGoToSearchAction
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

export const getMenu = async ({ params, token }: { params: any, token: string }) => {

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
                image: multimedia ? await getImage({ id: subItem.id, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: idView, token }) : null,
            };
        }));
        return {
            ...item,
            menuItems: subItems
        };
    }));

    return { title, menus: menuItems, multimedia, chip : { textoToHome : menus.textoToHome, actionHome : menus.actionHome } };
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

    const TipoContenido = data.find((item: any) => {

        return item.nombre === tipo;
    }, {});

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
        }
        const image = `data:image/jpeg;base64,${imageBase64}`;
        return image;
    } catch (error) {
        return noImageDefault;
    }
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

export const getContenidoFichaSucursalItem = async ({ idView, token }) => {

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

export const getAtributosCMS = async ({ idView, idMenu, arrayFilterJson, token }: { idView: string, idMenu: string, arrayFilterJson: string, token: string }) => {


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

    const carruselData = await response.json();

    const responseWithImages = await Promise.all(
        carruselData.Items.map(async (item: any) => {
            const { IdItem } = item;
            const image = await getImage({ id: IdItem, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenBanner, noImageDefault, idView: idVista, token });
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


export const getBannersVista = async ({ idVista, token, noImageDefault }: { idVista: string, token: string, noImageDefault: string | null }) => {


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
            const img = await getImage({ id: Id, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenBanner, noImageDefault, idView: idVista, token });
            return { ...item, img };
        })
    );

    return dataWithImages;
}


export const getVideosVista = async ({ idVista, token }: { idVista: string, token: string }) => {

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


export const getItems = async (idView, arrayFilterJson, idSucursal = 0, pagina = 0, ItemsPorPagina = 0, token, noImageDefault) => {



    const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_ITEMS}?IdVista=${idView}&IdSucursal=${idSucursal}&nPagina=${pagina}&ItemsPorPagina=${ItemsPorPagina}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify(arrayFilterJson)
    });

    const data = await response.json();

    noImageDefault = await getImage({ id: noImageDefault, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault, idView, token });



    const dataWithImages = await Promise.all(
        data.map(async (item: any) => {
            const { id } = item;
            const image = await getImage({ id, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault, idView, token });
            return { ...item, image };
        })
    );

    return dataWithImages;
}


export const getContenidoFichaItem = async (idView, token) => {


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
    idView,
    idProducto,
    token
}: {
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
            const image = await fetchImageById({ id: item.idImagen, idView, token });
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

    const templateNombre =  templateItems.find((item: any) => item.Key === "#NOMBRE#");
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
        itemBaseModel,
        templateNombre,
        templateCodigo,
        boxItems : aux2,
        othersProps: others
    };
};


export const getImagenAsDownload = async ({ id, token }: { id: string, token: string }) => {



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
