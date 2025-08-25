//API
import { API_ENDPOINT_CARRITO } from "./apiConfig";
//SESSION
import { TIPO_CONTENIDO_CONFIG } from "../cms-web-components/config/tipoContenidoConfig";
import { getImage } from "./apiContentSettings.server";


//NO BORRAR EL TAG DE PRUEBAS
const tag = "3436";
//NO BORRAR EL TAG DE PRUEBAS

export const getCarrito = async ({ token }: { token: string }) : Promise<any> => {
    const response = await fetch(`${API_ENDPOINT_CARRITO.GET}/Tag/${tag}`, {
        headers: {
            "Authorization": token
        }
    });

    const carrito = await response.json();

    const itemsWithImage = await Promise.all(carrito.items.map(async (item: any) => {
        return {
            ...item,
            image: await getImage({ id: item.idEntity, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: "0", token })
        }
    }));


    const { /* tag, */
        esAnonimo,
        esCliente,
        enProcesoDePago,
        strUusuario,
        strCliente,
        items,
        impuestos,
        importeTotal,
        importeSubTotalSinImpuestos,
        simboloMoneda
    } = carrito;

    return {
        esAnonimo,
        esCliente,
        enProcesoDePago,
        strUusuario,
        strCliente,
        simboloMoneda,
        data: [
            { type: "products", data: itemsWithImage, simboloMoneda },
            { type: "impuestos", data: impuestos, simboloMoneda },
            { type: "importe", data: importeTotal, simboloMoneda },
            { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
        ]
    };
}

export const updateCarrito = async ({ id, cantidad, token }: { id: string, cantidad: string, token: string }) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.ACTUALIZAR}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "tag": tag,
            "idItem": 0,
            "idEntity": id,
            "cantidad": Number(cantidad)
        })
    });

    if (!response.ok) {
        throw ("Failed to update Cart");
    }

    const carrito = await response.json();

    const itemsWithImage = await Promise.all(carrito.carritoActualizado.items.map(async (item: any) => {
        return {
            ...item,
            image: await getImage({ request: "", id: item.idEntity, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: "0", token })
        }
    }));

    carrito.carritoActualizado.items = itemsWithImage;



    const {
        /* tag, */
        carritoActualizado,
        itemActualizado
    } = carrito;

    const {
        impuestos,
        importeTotal,
        importeSubTotalSinImpuestos,
        simboloMoneda,
        esAnonimo,
        esCliente,
        enProcesoDePago,
        strUusuario,
        strCliente,
        items,
    } = carritoActualizado;

    return {
        esAnonimo,
        esCliente,
        enProcesoDePago,
        strUusuario,
        strCliente,
        simboloMoneda,
        data: [
            { type: "products", data: items },
            { type: "impuestos", data: impuestos },
            { type: "importe", data: importeTotal },
            { type: "importe", data: importeSubTotalSinImpuestos },
        ]
    };

}


export const clearCarrito = async ({ token, tag }: { token: string, tag: string }) => {
    const response = await fetch(`${API_ENDPOINT_CARRITO.CLEAR}/TAG/${tag}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
    });



};


export const removeItemFromCarrito = async ({ token, itemId }: { token: string, itemId: string }) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.REMOVEITEM}/TAG/${tag}/idItem/${itemId}`, {
        method: "DELETE",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw ("Failed to remove item from cart");
    }

    const carrito = await response.json();

    const itemsWithImage = await Promise.all(carrito.carritoActualizado.items.map(async (item: any) => {
        return {
            ...item,
            image: await getImage({ request: "", id: item.idEntity, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: "0", token })
        }
    }));

    carrito.carritoActualizado.items = itemsWithImage;

    return carrito;
};
