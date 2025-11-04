//API
import { API_ENDPOINT_CARRITO } from "./apiConfig";
//SESSION
import { TIPO_CONTENIDO_CONFIG } from "../cms-web-components/config/tipoContenidoConfig";
import { getImage } from "./apiContentSettings.server";
import { MercadoPagoConfig, Preference } from 'mercadopago';


//NO BORRAR EL TAG DE PRUEBAS
const tag = "3436";
//NO BORRAR EL TAG DE PRUEBAS

export const getWalletMP = async ({ token, shoppingCart }: { token: string, shoppingCart: any }): Promise<any> => {


    const productsItem = shoppingCart.data.find((item: any) => item.type === "products");
    const itemsAdapater = productsItem?.data.map((product: any) => ({
        id: product.idEntity,
        title: product.nombre,
        quantity: product.cantidad,
        unit_price: product.importeTotal,
    })) || [];

    const clientMercadoPago = new MercadoPagoConfig({ accessToken: 'APP_USR-5013139518551403-082911-00d70979ed5e2eccdd79911ab46b0496-2657543910' });
    const preference = new Preference(clientMercadoPago);


    try {
        const result = await preference.create({
            body: {
                items: [
                    ...itemsAdapater
                ],
                back_urls: {
                    success: "https://hikoki.com.ar/mp/success",
                    failure: "https://hikoki.com.ar/mp/failure",
                    pending: "https://hikoki.com.ar/mp/pending"
                },
                auto_return: "approved",
            }
        });
        return { id: result.id };
    } catch (error) {
        console.log(error);
        return { error: 'Error creating preference' };
    }
}

const CMS_EDITABLE = import.meta.env.VITE_CMS_EDITABLE === 'true' ? true : false;

export const getCarrito = async ({ token, centOpe }: { token: string, centOpe: string }): Promise<any> => {
    
    const response = await fetch(`${API_ENDPOINT_CARRITO.GET}/Tag/${tag}?esVersionEditable=${CMS_EDITABLE}&IdCentOpe=${centOpe}`, {
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
        simboloMoneda,
        costoEntrega
    } = carrito;

    const productos = [
        { type: "products", data: itemsWithImage, simboloMoneda },
        { type: "impuestos", data: impuestos, simboloMoneda },
        { type: "importe", data: importeTotal, simboloMoneda },
        { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },

    ]

    return {
        esAnonimo,
        esCliente,
        enProcesoDePago,
        strUusuario,
        strCliente,
        costoEntrega,
        productos: itemsWithImage,
        impuestos: impuestos,
        importeTotal: importeTotal,
        importeSubTotalSinImpuestos: importeSubTotalSinImpuestos,


        //viejo
        data: [
            { type: "products", data: itemsWithImage, simboloMoneda },
            { type: "impuestos", data: impuestos, simboloMoneda },
            { type: "importe", data: importeTotal, simboloMoneda },
            { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
            { type: "esAnonimo", esAnonimo, data: productos },
            { type: "esCliente", esCliente, data: productos }
        ]
    };
}

export const updateCarrito = async ({ id, idEntity, cantidad, token }: { id: string, idEntity: string, cantidad: string, token: string }) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.ACTUALIZAR}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "tag": tag,
            "idItem": id,
            "idEntity": idEntity,
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
            image: await getImage({ id: item.idEntity, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: "0", token })
        }
    }));


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
        productos: itemsWithImage,
        impuestos: impuestos,
        importeTotal: importeTotal,
        importeSubTotalSinImpuestos: importeSubTotalSinImpuestos,


        data: [
            { type: "products", data: itemsWithImage, simboloMoneda },
            { type: "impuestos", data: impuestos, simboloMoneda },
            { type: "importe", data: importeTotal, simboloMoneda },
            { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
            { type: "esAnonimo", data: esAnonimo },
            { type: "esCliente", data: esCliente }

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


export const removeItemFromCarrito = async ({ token, itemId, centOpe }: { token: string, itemId: string, centOpe?: string }) => {

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

    // Verificar si la respuesta tiene contenido antes de parsear JSON
    const text = await response.text();
    
    // Si la respuesta está vacía (solo 200 OK), recargar el carrito
    if (!text || text.trim() === "") {
        // Recargar el carrito después de eliminar el item
        const centOpeToUse = centOpe || "2"; // Valor por defecto
        const carritoRecargado = await getCarrito({ token, centOpe: centOpeToUse });
        return carritoRecargado;
    }

    let carrito;
    try {
        carrito = JSON.parse(text);
    } catch (error) {
        throw new Error("Invalid JSON response from server");
    }

    const itemsWithImage = await Promise.all(carrito.carritoActualizado.items.map(async (item: any) => {
        return {
            ...item,
            image: await getImage({ id: item.idEntity, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: "0", token })
        }
    }));

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
            { type: "products", data: itemsWithImage, simboloMoneda },
            { type: "impuestos", data: impuestos, simboloMoneda },
            { type: "importe", data: importeTotal, simboloMoneda },
            { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
        ]
    };
    return carrito;
};


export const updateEnvioCarrito = async ({ msgRequest, msgResponse, strDireccion, strMetodoEnvio, codtoEnvio, token }: { msgRequest: any, msgResponse: any, strDireccion: string, strMetodoEnvio: string, codtoEnvio: string, token: string }) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.ACTUALIZAR_ENVIO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "tag": tag,
            "strDireccion": strDireccion,
            "strMetodoEnvio": strMetodoEnvio,
            "costoEnvio": codtoEnvio,
            "msgRequest": JSON.stringify(msgRequest),
            "msgResponse": JSON.stringify(msgResponse)
        })
    });



    if (!response.ok) {
        const errorData = await response.json();
        throw (errorData?.message || "Fallo la actualización del envío del carrito");
    }

    return { success: true };

}



export const postPrepararPagoCarrito = async ({
    msgRequest,
    token
}: {
    msgRequest: any,
    token: string
}) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_PREPARAR_PAGO_CARRITO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "tag": tag,
            "msgRequest": JSON.stringify(msgRequest),
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw (errorData?.message || "Fallo la preparacion del carrito");
    }

    return { success: true };

}

export const postRegistratDatosEnvioCarrito = async ({
    msgRequest,
    msgResponse,
    strDireccion,
    strMetodoEnvio,
    idDireccionEnvio,
    costoEnvio,
    token
}: {
    msgRequest: string,
    msgResponse: string,
    strDireccion: string,
    strMetodoEnvio: string,
    idDireccionEnvio: number,
    costoEnvio: number,
    token: string
}) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_ENVIO_CARRITO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "tag": tag,
            "msgRequest": msgRequest,
            "msgResponse": msgResponse,
            "strDireccion": strDireccion,
            "strMetodoEnvio": strMetodoEnvio,
            "idDireccionEnvio": idDireccionEnvio,
            "costoEnvio": costoEnvio
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw (errorData?.message || "Fallo la preparacion del envio del carrito");
    }

    return { success: true };
}

export const postRegistrarPagoCarrito = async ({
    msgPago,
    token
}: {
    msgPago: string,
    token: string
}) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_ENVIO_CARRITO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "tag": tag,
            "msgPago": msgPago
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw (errorData?.message || "Fallo el registro del pago del carrito");
    }

    return { success: true };
}