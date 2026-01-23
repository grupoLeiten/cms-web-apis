//API
import { API_ENDPOINT_CARRITO } from "./apiConfig";
//SESSION
import { TIPO_CONTENIDO_CONFIG } from "../cms-web-components/config/tipoContenidoConfig";
import { getImage } from "./apiContentSettings";

const CMS_EDITABLE = false;

const productAdapater = async (shoppingCart: any, token: string) => {

    return {
        ...shoppingCart,
        items: await Promise.all(shoppingCart.items.map(async (item: any) => ({
            ...item,
            image: await getImage({ id: item.idEntity, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: "0", token }),
            preUniConMoneda: `${shoppingCart.simboloMoneda} ${item.preUniAsString}`,
            preUni: item.preUniAsString,
            importeTotal: item.importeTotalAsString,
            importeTotalMercadoPago: item.importeTotalConImpuestosAsNumber,
            importeTotalConMoneda: `${shoppingCart.simboloMoneda} ${item.importeTotalAsString}`
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
            sinMoneda: shoppingCart.CostoEntregaFinalAsString,
            conMoneda: `${shoppingCart.simboloMoneda} ${shoppingCart.CostoEntregaFinalAsString}`
        },
        costoEntregaFinalAsNumber: shoppingCart.costoEntregaFinalAsNumber
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
        simboloMoneda,

        costoEntregaAsString,
        costoEntregaFinalAsNumber,
        // Campos de envío
        strMetodoEnvio,
        strDireccion
    } = shoppingCart;

    return {
        idCarrito,
        esAnonimo,
        esCliente,
        enProcesoDePago,
        strUusuario,
        strCliente,
        simboloMoneda,
        // Campos de envío con los nombres que espera SummaryStepPage
        strMetodoEntrega: strMetodoEnvio || "",
        strDireccionEntrega: strDireccion || "",
        items: await Promise.all(items.map(async (item: any) => ({
            ...item,
            image: await getImage({ id: item.idEntity, tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica, noImageDefault: "", idView: "0", token }),
            preUniConMoneda: `${simboloMoneda} ${item.preUni}`,
            preUni: item.preUni,
            importeTotal: item.importeTotal,
            importeTotalConMoneda: `${simboloMoneda} ${item.importeTotal}`,
            simboloMoneda,
        }))),
        impuestos: await Promise.all(impuestos.map(async (impuesto: any) => ({
            ...impuesto,
            importeImpuesto: impuesto.importeImpuesto,
            simboloMoneda,
            importeImpuestoConMoneda: `${simboloMoneda} ${impuesto.importeImpuesto}`
        }))),
        importeTotal: {
            sinMoneda: importeTotal,
            simboloMoneda,
            conMoneda: `${simboloMoneda} ${importeTotal}`
        },
        importeSubTotalSinImpuestos: {
            sinMoneda: importeSubTotalSinImpuestos,
            simboloMoneda,
            conMoneda: `${simboloMoneda} ${importeSubTotalSinImpuestos}`
        },
        costoEntrega: {
            sinMoneda: costoEntregaAsString,
            simboloMoneda,
            conMoneda: `${simboloMoneda} ${costoEntregaAsString}`
        },
        costoEntregaFinalAsNumber: costoEntregaFinalAsNumber
    }
}

export const getShoppingCart = async ({ token, tag, centOpe, carritoCerrado }: { token: string, tag: string, centOpe: string, carritoCerrado: boolean }): Promise<any> => {


    const response = await fetch(`${API_ENDPOINT_CARRITO.GET}/Tag/${tag}?esVersionEditable=${false}&IdCentOpe=${centOpe}&controlCierre=${carritoCerrado}`, {
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
        const errorBody = await response.text().catch(() => "");
        throw new Error(`Error del servidor (${response.status}): ${errorBody || response.statusText}`);
    }

    const carritoResponse = await response.json();
    const shoppingCartAdaptado = await shoppingCartAdapter(carritoResponse.carritoActualizado, token);
    return shoppingCartAdaptado;
}

export const removeItemFromShoppingCart = async ({ itemId, tag, token }: { itemId: string, tag: string, token: string }) => {
    const response = await fetch(`${API_ENDPOINT_CARRITO.REMOVEITEM}/TAG/${tag}/idItem/${itemId}`, {
        method: "DELETE",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(`Error del servidor (${response.status}): ${errorBody || response.statusText}`);
    }

}

export const getCarrito = async ({ token, tag, centOpe, carritoCerrado = false }: { token: string, tag: string, centOpe: string, carritoCerrado?: boolean }): Promise<any> => {

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
        simboloMoneda,
        costoEntrega,
        costoEntregaFinalAsNumber,
    } = carritoAdaptado;

    const productos = [
        { type: "products", data: carritoAdaptado.items, simboloMoneda },
        { type: "impuestos", data: impuestos, simboloMoneda },
        { type: "importe", data: importeTotal, simboloMoneda },
        { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
    ]

    return {
        idCarrito,
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
        costoEntregaFinalAsNumber,

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
        const errorBody = await response.text().catch(() => "");
        throw new Error(`Error del servidor (${response.status}): ${errorBody || response.statusText}`);
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
    msgResponse,
    token,
    tag
}: {
    msgRequest: any,
    token: string,
    tag: string
    msgResponse: any
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
            msgResponse: msgResponse
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
    if (!response.ok) {
        const errorData = await response.json();
        throw (errorData?.message || "Fallo el registro de datos de envio del carrito");
    }
    return { success: true };
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