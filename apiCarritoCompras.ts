//API
import { API_ENDPOINT_CARRITO } from "./apiConfig";
//SESSION
import { TIPO_CONTENIDO_CONFIG } from "../cms-web-components/config/tipoContenidoConfig";
import { getImage } from "./apiContentSettings";



const CMS_EDITABLE = import.meta.env.VITE_CMS_EDITABLE === 'true' ? true : false;

const productAdapater = async (shoppingCart: any, token: string) => {
    return {
        ...shoppingCart,
        items: await Promise.all(shoppingCart.items.map(async (item: any) => ({
            ...item,
            image: await getImage({ id: item.idEntity, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: "0", token }),
            preUniConMoneda: `${shoppingCart.simboloMoneda} ${item.preUni}`,
            preUni: item.preUni,
            importeTotal: item.importeTotal,
            importeTotalConMoneda: `${shoppingCart.simboloMoneda} ${item.importeTotal}`
        }))),
        impuestos: await Promise.all(shoppingCart.impuestos.map(async (impuesto: any) => ({
            ...impuesto,
            importeImpuesto: impuesto.importeImpuesto,
            importeImpuestoConMoneda: `${shoppingCart.simboloMoneda} ${impuesto.importeImpuesto}`
        }))),
        importeTotal: {
            sinMoneda: shoppingCart.importeTotal,
            conMoneda: `${shoppingCart.simboloMoneda} ${shoppingCart.importeTotal}`
        },
        importeSubTotalSinImpuestos: {
            sinMoneda: shoppingCart.importeSubTotalSinImpuestos,
            conMoneda: `${shoppingCart.simboloMoneda} ${shoppingCart.importeSubTotalSinImpuestos}`
        },
        costoEntrega: {
            sinMoneda: shoppingCart.costoEntrega,
            conMoneda: `${shoppingCart.simboloMoneda} ${shoppingCart.costoEntrega}`
        }
    }
}

const shoppingCartAdapter = async (shoppingCart: any, token: string) => {
    const {
        idCarrito,
        esAnonimo,
        esCliente,
        enProcesoDePago,
        strUusuario,
        strCliente,
        items,
        impuestos,
        importeTotal,
        importeSubTotalSinImpuestos,
        costoEntrega,
        simboloMoneda
    } = shoppingCart;
    
    return {
        idCarrito,
        esAnonimo,
        esCliente,
        enProcesoDePago,
        strUusuario,
        strCliente,
        simboloMoneda,
        items: await Promise.all(items.map(async (item: any) => ({
            ...item,
            image: await getImage({ id: item.idEntity, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: "0", token }),
            preUniConMoneda: `${simboloMoneda} ${item.preUni}`,
            preUni: item.preUni,
            importeTotal: item.importeTotal,
            importeTotalConMoneda: `${simboloMoneda} ${item.importeTotal}`
        }))),
        impuestos: await Promise.all(impuestos.map(async (impuesto: any) => ({
            ...impuesto,
            importeImpuesto: impuesto.importeImpuesto,
            importeImpuestoConMoneda: `${simboloMoneda} ${impuesto.importeImpuesto}`
        }))),
        importeTotal: {
            sinMoneda: importeTotal,
            conMoneda: `${simboloMoneda} ${importeTotal}`
        },
        importeSubTotalSinImpuestos: {
            sinMoneda: importeSubTotalSinImpuestos,
            conMoneda: `${simboloMoneda} ${importeSubTotalSinImpuestos}`
        },
        costoEntrega: {
            sinMoneda: costoEntrega,
            conMoneda: `${simboloMoneda} ${costoEntrega}`
        }
    }
}

export const getShoppingCart = async ({ token, tag, centOpe, carritoCerrado = true }: { token: string, tag: string, centOpe: string, carritoCerrado: boolean }): Promise<any> => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.GET}/Tag/${tag}?esVersionEditable=${CMS_EDITABLE}&IdCentOpe=${centOpe}&controlCierre=${carritoCerrado}`, {
        headers: {
            "Authorization": token
        }
    });

    if (!response.ok) {
        return { error: "Failed to get cart" };
    }

    const carritoResponse = await response.json();

    const shoppingCartAdaptado = await shoppingCartAdapter(carritoResponse, token);

    return shoppingCartAdaptado;
}


export const updateShoppingCart = async ({ id, idEntity, cantidad, tag, token }: { id: string, idEntity: string, cantidad: string, tag: string, token: string }) => {
    console.log("========== [apiCarritoCompras.updateShoppingCart] INICIO ==========");
    console.log("[updateShoppingCart] Timestamp:", new Date().toISOString());
    console.log("[updateShoppingCart] Parámetros recibidos:");
    console.log("  - id (idItem):", id);
    console.log("  - idEntity:", idEntity);
    console.log("  - cantidad:", cantidad);
    console.log("  - tag:", tag?.substring(0, 50) + "...");
    console.log("  - token presente:", !!token);
    
    const endpoint = `${API_ENDPOINT_CARRITO.ACTUALIZAR}`;
    console.log("[updateShoppingCart] Endpoint:", endpoint);
    
    const bodyData = {
        "tag": tag,
        "idItem": id,
        "idEntity": idEntity,
        "cantidad": Number(cantidad)
    };
    console.log("[updateShoppingCart] Body a enviar:", JSON.stringify(bodyData, null, 2));

    let response;
    try {
        response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });
        
        console.log("[updateShoppingCart] Response status:", response.status);
        console.log("[updateShoppingCart] Response statusText:", response.statusText);
        console.log("[updateShoppingCart] Response ok:", response.ok);
        console.log("[updateShoppingCart] Response headers:", JSON.stringify(Object.fromEntries(response.headers.entries())));
        
    } catch (fetchError: any) {
        console.error("========== [updateShoppingCart] ERROR DE FETCH ==========");
        console.error("[updateShoppingCart] Error de red/fetch:", fetchError?.message || fetchError);
        console.error("[updateShoppingCart] Error stack:", fetchError?.stack);
        throw new Error(`Error de red al conectar con el servidor: ${fetchError?.message || fetchError}`);
    }

    if (!response.ok) {
        let errorBody = "";
        try {
            errorBody = await response.text();
            console.error("========== [updateShoppingCart] ERROR DEL SERVIDOR ==========");
            console.error("[updateShoppingCart] Status:", response.status);
            console.error("[updateShoppingCart] StatusText:", response.statusText);
            console.error("[updateShoppingCart] Response body:", errorBody);
        } catch (e) {
            console.error("[updateShoppingCart] No se pudo leer el body del error");
        }
        throw new Error(`Error del servidor (${response.status}): ${errorBody || response.statusText}`);
    }

    let carritoResponse;
    try {
        const responseText = await response.text();
        console.log("[updateShoppingCart] Response text (primeros 1000 chars):", responseText.substring(0, 1000));
        
        carritoResponse = JSON.parse(responseText);
        console.log("[updateShoppingCart] Response parseado correctamente");
        console.log("[updateShoppingCart] carritoActualizado existe:", !!carritoResponse?.carritoActualizado);
        
    } catch (parseError: any) {
        console.error("========== [updateShoppingCart] ERROR DE PARSEO ==========");
        console.error("[updateShoppingCart] Error al parsear JSON:", parseError?.message);
        throw new Error(`Error al parsear respuesta del servidor: ${parseError?.message}`);
    }

    try {
        console.log("[updateShoppingCart] Adaptando carrito...");
        const shoppingCartAdaptado = await shoppingCartAdapter(carritoResponse.carritoActualizado, token);
        console.log("[updateShoppingCart] Carrito adaptado exitosamente");
        console.log("========== [apiCarritoCompras.updateShoppingCart] FIN EXITOSO ==========");
        return shoppingCartAdaptado;
    } catch (adapterError: any) {
        console.error("========== [updateShoppingCart] ERROR EN ADAPTER ==========");
        console.error("[updateShoppingCart] Error en shoppingCartAdapter:", adapterError?.message);
        console.error("[updateShoppingCart] carritoActualizado recibido:", JSON.stringify(carritoResponse?.carritoActualizado, null, 2)?.substring(0, 500));
        throw new Error(`Error al adaptar el carrito: ${adapterError?.message}`);
    }
}

export const removeItemFromShoppingCart = async ({ itemId,  tag, token }: { itemId: string, tag: string, token: string }) => {
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

}

export const getCarrito = async ({ token, tag, centOpe, carritoCerrado = true }: { token: string, tag: string, centOpe: string, carritoCerrado?: boolean }): Promise<any> => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.GET}/Tag/${tag}?esVersionEditable=${CMS_EDITABLE}&IdCentOpe=${2}&controlCierre=${carritoCerrado}`, {
        headers: {
            "Authorization": token
        }
    });

    if (!response.ok) {
        return { error: "Failed to get cart" };
    }

    const carrito = await response.json();



    const carritoAdaptado = await productAdapater(carrito, token);


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
        costoEntrega,
    } = carritoAdaptado;

    const productos = [
        { type: "products", data: carritoAdaptado.items, simboloMoneda },
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
        productos: carritoAdaptado.items.map((producto: any) => ({ ...producto, simboloMoneda })),
        impuestos: impuestos.map((impuesto: any) => ({ ...impuesto, simboloMoneda })),
        importeTotal,
        importeSubTotalSinImpuestos,


        //viejo
        data: [
            { type: "products", data: carritoAdaptado.items, simboloMoneda },
            { type: "impuestos", data: impuestos, simboloMoneda },
            { type: "importe", data: importeTotal, simboloMoneda },
            { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
            { type: "esAnonimo", esAnonimo, data: productos },
            { type: "esCliente", esCliente, data: productos }
        ]
    };
}

export const getComponenteToVista = async ({ token }: { token: string }): Promise<{ vistasCarrito: any }> => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.GET_COMPONENTE_TO_VISTA}`, {
        headers: {
            "Authorization": token
        }
    });

    if (!response.ok) {
        return { vistasCarrito: [] };
    }

    const vistasCarrito = await response.json();

    return { vistasCarrito };
}

export const updateCarrito = async ({ id, idEntity, cantidad, tag, token }: { id: string, idEntity: string, cantidad: string, tag: string, token: string }) => {

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

    const carritoAdaptado = await productAdapater(carrito.carritoActualizado, token);


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
    } = carritoAdaptado;

    const productos = [
        { type: "products", data: carritoAdaptado.items, simboloMoneda },
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
        // costoEntrega,
        productos: carritoAdaptado.items.map((producto: any) => ({ ...producto, simboloMoneda })),
        impuestos: impuestos.map((impuesto: any) => ({ ...impuesto, simboloMoneda })),
        importeTotal,
        importeSubTotalSinImpuestos,


        //viejo
        data: [
            { type: "products", data: carritoAdaptado.items, simboloMoneda },
            { type: "impuestos", data: impuestos, simboloMoneda },
            { type: "importe", data: importeTotal, simboloMoneda },
            { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
            { type: "esAnonimo", esAnonimo, data: productos },
            { type: "esCliente", esCliente, data: productos }
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


export const removeItemFromCarrito = async ({ token, itemId, centOpe, tag }: { token: string, itemId: string, centOpe?: string, tag: string }) => {

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
        const carritoRecargado = await getCarrito({ token, tag, centOpe: centOpeToUse });
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
        productos: itemsWithImage,
        impuestos: impuestos,
        importeTotal: importeTotal,
        importeSubTotalSinImpuestos: importeSubTotalSinImpuestos,
        costoEntrega: carritoActualizado.costoEntrega || 0,
        data: [
            { type: "products", data: itemsWithImage, simboloMoneda },
            { type: "impuestos", data: impuestos, simboloMoneda },
            { type: "importe", data: importeTotal, simboloMoneda },
            { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
        ]
    };
};


export const updateEnvioCarrito = async ({ msgRequest, msgResponse, strDireccion, strMetodoEnvio, costoEnvio, idDireccionEnvio, token, tag }: { msgRequest: any, msgResponse: any, strDireccion: string, strMetodoEnvio: string, costoEnvio: number, idDireccionEnvio: number, token: string, tag: string }) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_ENVIO_CARRITO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "tag": tag,
            "strDireccion": strDireccion,
            "strMetodoEnvio": strMetodoEnvio,
            "idDireccionEnvio": idDireccionEnvio,
            "costoEnvio": costoEnvio,
            "msgRequest": JSON.parse(msgRequest),
            "msgResponse": JSON.parse(msgResponse)
        })
    });


    if (!response.ok) {
        const errorData = await response.json();
        throw (errorData?.message || "Fallo la actualización del envío del carrito");
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
    token,
    tag
}: {
    msgRequest: string,
    msgResponse: string,
    strDireccion: string,
    strMetodoEnvio: string,
    idDireccionEnvio: number,
    costoEnvio: number,
    token: string,
    tag: string
}) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_ENVIO_CARRITO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tag: tag,
            msgRequest: msgRequest,
            msgResponse: msgResponse,
            strDireccion: strDireccion,
            strMetodoEnvio: strMetodoEnvio,
            idDireccionEnvio: idDireccionEnvio,
            costoEnvio: costoEnvio
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw (errorData?.message || "Fallo la preparacion del envio del carrito");
    }

    return { success: true };
}

export const postPrepararPagoCarrito = async ({
    msgRequest,
    token,
    tag
}: {
    msgRequest: any,
    token: string,
    tag: string
}) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_PREPARAR_PAGO_CARRITO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tag: tag,
            msgRequest: msgRequest,
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        return { success: true };
    }

    return { success: true };

}


export const postRegistrarPagoCarrito = async ({
    msgPago,
    token,
    tag
}: {
    msgPago: any,
    token: string,
    tag: string
}) => {

    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_PAGO_CARRITO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tag: tag,
            msgPago: msgPago
        })
    });

    if (!response.ok) {
        const errorData = await response.json();

        //throw (errorData?.message || "Fallo el registro del pago del carrito");
        return { success: true };
    }

    return { success: true };
}



export const PostRegistrarDatosPreEnvioCarrito = async ({
    token,
    tag,
    msgRequest,
    msgResponse
}: {    
    token: string,
    tag: string,
    msgRequest: any,
    msgResponse: any
}) => {
    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_DATOS_PRE_ENVIO_CARRITO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tag: tag,
            msgRequest: msgRequest,
            msgResponse: msgResponse,
          })
    });
}

export const PostRegistrarDatosEnvioCarrito = async ({
    token,
    tag,
    msgRequest,
    msgResponse
}: {    
    token: string,
    tag: string,
    msgRequest: any,
    msgResponse: any
}) => {
    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_DATOS_PRE_ENVIO_CARRITO}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tag: tag,
            msgRequest: msgRequest,
            msgResponse: msgResponse,
          })
    });
}

export const postRegistrarCotizacionEnvioCarrito = async ({
    token,
    tag,
    msgRequest,
    msgResponse,
    strDireccion,
    strMetodoEnvio,
    idDireccionEnvio,
    costoEnvio
}: {    
    token: string,
    tag: string,
    msgRequest: string,
    msgResponse: string,
    strDireccion: string,
    strMetodoEnvio: string,
    idDireccionEnvio: number,
    costoEnvio: number
}) => {
    const msgRequestParsed = JSON.parse(msgRequest);
    const msgResponseParsed = JSON.parse(msgResponse);
    const response = await fetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_COTIZACION}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tag: tag,
            msgRequest: msgRequestParsed,
            msgResponse: msgResponseParsed,
            strDireccion: strDireccion,
            strMetodoEnvio: strMetodoEnvio,
            idDireccionEnvio: idDireccionEnvio,
            costoEnvio: costoEnvio
        })
    });
}