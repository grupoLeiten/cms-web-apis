import { API_ENDPOINT_CARRITO, ID_CENTRO_OPERACION } from "./apiConfig";
import { apiFetch } from "./apiClient";
import { TIPO_CONTENIDO_CONFIG } from "../config/tipoContenidoConfig";
import { getImage } from "./apiContentSettings";

const CMS_EDITABLE = false;

/** Parsea el body como JSON; si está vacío o no es JSON válido, devuelve {}. Evita "Unexpected end of JSON input". */
async function safeResponseJson(response: Response): Promise<any> {
  const text = await response.text();
  if (!text || text.trim() === "") return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

// Adapters: lógica de presentación - migrar a capa de consumidores en el futuro
const productAdapter = async (shoppingCart: any, token: string) => {
  return {
    ...shoppingCart,
    items: await Promise.all(
      shoppingCart.items.map(async (item: any) => ({
        ...item,
        image: await getImage({
          id: item.idEntity,
          tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica,
          noImageDefault: "",
          idView: "0",
          token,
        }),
        preUniConMoneda: `${shoppingCart.simboloMoneda} ${item.preUniAsString}`,
        preUni: item.preUniAsString,
        importeTotal: item.importeTotalAsString,
        importeTotalMercadoPago: item.importeTotalConImpuestosAsNumber,
        importeTotalConMoneda: `${shoppingCart.simboloMoneda} ${item.importeTotalAsString}`,
      }))
    ),
    impuestos: shoppingCart.impuestos.map((impuesto: any) => ({
      ...impuesto,
      importeImpuesto: impuesto.importeImpuesto,
      importeImpuestoConMoneda: `${shoppingCart.simboloMoneda} ${impuesto.importeImpuesto}`,
    })),
    importeTotal: {
      sinMoneda: shoppingCart.importeTotal,
      conMoneda: `${shoppingCart.simboloMoneda} ${shoppingCart.importeTotal}`,
    },
    importeSubTotalSinImpuestos: {
      sinMoneda: shoppingCart.importeSubTotalSinImpuestos,
      conMoneda: `${shoppingCart.simboloMoneda} ${shoppingCart.importeSubTotalSinImpuestos}`,
    },
    costoEntrega: {
      sinMoneda: shoppingCart.CostoEntregaFinalAsString,
      conMoneda: `${shoppingCart.simboloMoneda} ${shoppingCart.CostoEntregaFinalAsString}`,
    },
    costoEntregaFinalAsNumber: shoppingCart.costoEntregaFinalAsNumber,
  };
};

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
    costoEntregaAsString,
    costoEntregaFinalAsNumber,
    strMetodoEnvio,
    strDireccion,
    simboloMoneda,
  } = shoppingCart;

  return {
    idCarrito,
    esAnonimo,
    esCliente,
    enProcesoDePago,
    strUusuario,
    strCliente,
    simboloMoneda,
    strMetodoEntrega: strMetodoEnvio || "",
    strDireccionEntrega: strDireccion || "",
    items: await Promise.all(
      items.map(async (item: any) => ({
        ...item,
        image: await getImage({
          id: item.idEntity,
          tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica,
          noImageDefault: "",
          idView: "0",
          token,
        }),
        preUniConMoneda: `${simboloMoneda} ${item.preUni}`,
        preUni: item.preUni,
        importeTotal: item.importeTotal,
        importeTotalConMoneda: `${simboloMoneda} ${item.importeTotal}`,
        simboloMoneda,
      }))
    ),
    impuestos: impuestos.map((impuesto: any) => ({
      ...impuesto,
      importeImpuesto: impuesto.importeImpuesto,
      simboloMoneda,
      importeImpuestoConMoneda: `${simboloMoneda} ${impuesto.importeImpuesto}`,
    })),
    importeTotal: {
      sinMoneda: importeTotal,
      simboloMoneda,
      conMoneda: `${simboloMoneda} ${importeTotal}`,
    },
    importeSubTotalSinImpuestos: {
      sinMoneda: importeSubTotalSinImpuestos,
      simboloMoneda,
      conMoneda: `${simboloMoneda} ${importeSubTotalSinImpuestos}`,
    },
    costoEntrega: {
      sinMoneda: costoEntregaAsString,
      simboloMoneda,
      conMoneda: `${simboloMoneda} ${costoEntregaAsString}`,
    },
    costoEntregaFinalAsNumber: costoEntregaFinalAsNumber,
  };
};

export const getShoppingCart = async ({
  token,
  tag,
  centOpe,
  carritoCerrado,
}: {
  token: string;
  tag: string;
  centOpe: string;
  carritoCerrado: boolean;
}): Promise<any> => {
  const url = `${API_ENDPOINT_CARRITO.GET}/Tag/${tag}?esVersionEditable=${false}&IdCentOpe=${centOpe}&controlCierre=${carritoCerrado}`;
  const response = await apiFetch(url, { token });
  const carritoResponse = await response.json();
  return shoppingCartAdapter(carritoResponse, token);
};

export const updateShoppingCart = async ({
  id,
  idEntity,
  cantidad,
  tag,
  token,
}: {
  id: string;
  idEntity: string;
  cantidad: string;
  tag: string;
  token: string;
}) => {
  const response = await apiFetch(`${API_ENDPOINT_CARRITO.ACTUALIZAR}`, {
    method: "POST",
    token,
    body: JSON.stringify({
      tag,
      idItem: id,
      idEntity,
      cantidad: Number(cantidad),
    }),
  });
  const carritoResponse = await response.json();
  console.log("[updateShoppingCart] Respuesta cruda backend (agregar producto):", JSON.stringify(carritoResponse, null, 2));
  return shoppingCartAdapter(carritoResponse.carritoActualizado, token);
};

export const removeItemFromShoppingCart = async ({
  itemId,
  tag,
  token,
}: {
  itemId: string;
  tag: string;
  token: string;
}) => {
  await apiFetch(
    `${API_ENDPOINT_CARRITO.REMOVEITEM}/TAG/${tag}/idItem/${itemId}`,
    { method: "DELETE", token }
  );
};

export const getCarrito = async ({
  token,
  tag,
  centOpe,
  carritoCerrado = false,
}: {
  token: string;
  tag: string;
  centOpe: string;
  carritoCerrado?: boolean;
}): Promise<any> => {
  const centOpeToUse = centOpe || ID_CENTRO_OPERACION;
  const url = `${API_ENDPOINT_CARRITO.GET}/Tag/${tag}?esVersionEditable=${CMS_EDITABLE}&IdCentOpe=${centOpeToUse}&controlCierre=${carritoCerrado}`;
  const response = await apiFetch(url, { token });
  const carrito = await response.json();
  const carritoAdaptado = await productAdapter(carrito, token);

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
    simboloMoneda,
    costoEntrega,
    costoEntregaFinalAsNumber,
  } = carritoAdaptado;

  const productos = [
    { type: "products", data: carritoAdaptado.items, simboloMoneda },
    { type: "impuestos", data: impuestos, simboloMoneda },
    { type: "importe", data: importeTotal, simboloMoneda },
    { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
  ];

  return {
    idCarrito,
    esAnonimo,
    esCliente,
    enProcesoDePago,
    strUusuario,
    strCliente,
    costoEntrega,
    productos: carritoAdaptado.items.map((p: any) => ({ ...p, simboloMoneda })),
    impuestos: impuestos.map((i: any) => ({ ...i, simboloMoneda })),
    importeTotal,
    importeSubTotalSinImpuestos,
    costoEntregaFinalAsNumber,
    data: [
      ...productos,
      { type: "esAnonimo", esAnonimo, data: productos },
      { type: "esCliente", esCliente, data: productos },
    ],
  };
};

export const getComponenteToVista = async ({
  token,
}: {
  token: string;
}): Promise<{ vistasCarrito: any }> => {
  const response = await apiFetch(`${API_ENDPOINT_CARRITO.GET_COMPONENTE_TO_VISTA}`, {
    token,
  });
  const vistasCarrito = await response.json();
  return { vistasCarrito };
};

export const updateCarrito = async ({
  id,
  idEntity,
  cantidad,
  tag,
  token,
}: {
  id: string;
  idEntity: string;
  cantidad: string;
  tag: string;
  token: string;
}) => {
  const response = await apiFetch(`${API_ENDPOINT_CARRITO.ACTUALIZAR}`, {
    method: "POST",
    token,
    body: JSON.stringify({
      tag,
      idItem: id,
      idEntity,
      cantidad: Number(cantidad),
    }),
  });
  const carrito = await response.json();
  const carritoAdaptado = await productAdapter(carrito.carritoActualizado, token);

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
  } = carritoAdaptado;

  const productos = [
    { type: "products", data: carritoAdaptado.items, simboloMoneda },
    { type: "impuestos", data: impuestos, simboloMoneda },
    { type: "importe", data: importeTotal, simboloMoneda },
    { type: "importeSubTotalSinImpuestos", data: importeSubTotalSinImpuestos, simboloMoneda },
  ];

  return {
    esAnonimo,
    esCliente,
    enProcesoDePago,
    strUusuario,
    strCliente,
    productos: carritoAdaptado.items.map((p: any) => ({ ...p, simboloMoneda })),
    impuestos: impuestos.map((i: any) => ({ ...i, simboloMoneda })),
    importeTotal,
    importeSubTotalSinImpuestos,
    data: [
      ...productos,
      { type: "esAnonimo", esAnonimo, data: productos },
      { type: "esCliente", esCliente, data: productos },
    ],
  };
};

export const clearCarrito = async ({ token, tag }: { token: string; tag: string }) => {
  await apiFetch(`${API_ENDPOINT_CARRITO.CLEAR}/TAG/${tag}`, {
    method: "DELETE",
    token,
  });
};

export const removeItemFromCarrito = async ({
  token,
  itemId,
  centOpe,
  tag,
}: {
  token: string;
  itemId: string;
  centOpe?: string;
  tag: string;
}) => {
  const response = await apiFetch(
    `${API_ENDPOINT_CARRITO.REMOVEITEM}/TAG/${tag}/idItem/${itemId}`,
    { method: "DELETE", token }
  );
  const text = await response.text();

  if (!text || text.trim() === "") {
    const centOpeToUse = centOpe || ID_CENTRO_OPERACION;
    return getCarrito({ token, tag, centOpe: centOpeToUse });
  }

  const carrito = JSON.parse(text);
  const itemsWithImage = await Promise.all(
    carrito.carritoActualizado.items.map(async (item: any) => ({
      ...item,
      image: await getImage({
        id: item.idEntity,
        tipoContenido: TIPO_CONTENIDO_CONFIG.ImagenChica,
        noImageDefault: "",
        idView: "0",
        token,
      }),
    }))
  );

  const ca = carrito.carritoActualizado;

  return {
    esAnonimo: ca.esAnonimo,
    esCliente: ca.esCliente,
    enProcesoDePago: ca.enProcesoDePago,
    strUusuario: ca.strUusuario,
    strCliente: ca.strCliente,
    simboloMoneda: ca.simboloMoneda,
    productos: itemsWithImage,
    impuestos: ca.impuestos,
    importeTotal: ca.importeTotal,
    importeSubTotalSinImpuestos: ca.importeSubTotalSinImpuestos,
    costoEntrega: ca.costoEntrega || 0,
    data: [
      { type: "products", data: itemsWithImage, simboloMoneda: ca.simboloMoneda },
      { type: "impuestos", data: ca.impuestos, simboloMoneda: ca.simboloMoneda },
      { type: "importe", data: ca.importeTotal, simboloMoneda: ca.simboloMoneda },
      { type: "importeSubTotalSinImpuestos", data: ca.importeSubTotalSinImpuestos, simboloMoneda: ca.simboloMoneda },
    ],
  };
};

export const updateEnvioCarrito = async ({
  msgRequest,
  msgResponse,
  strDireccion,
  strMetodoEnvio,
  costoEnvio,
  idDireccionEnvio,
  token,
  tag,
}: {
  msgRequest: any;
  msgResponse: any;
  strDireccion: string;
  strMetodoEnvio: string;
  costoEnvio: number;
  idDireccionEnvio: number;
  token: string;
  tag: string;
}) => {
  const response = await apiFetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_ENVIO_CARRITO}`, {
    method: "POST",
    token,
    body: JSON.stringify({
      tag,
      strDireccion,
      strMetodoEnvio,
      idDireccionEnvio,
      costoEnvio,
      msgRequest: typeof msgRequest === "string" ? JSON.parse(msgRequest) : msgRequest,
      msgResponse: typeof msgResponse === "string" ? JSON.parse(msgResponse) : msgResponse,
    }),
  });
  return safeResponseJson(response);
};

export const postRegistratDatosEnvioCarrito = async ({
  msgRequest,
  msgResponse,
  strDireccion,
  strMetodoEnvio,
  idDireccionEnvio,
  costoEnvio,
  token,
  tag,
}: {
  msgRequest: string;
  msgResponse: string;
  strDireccion: string;
  strMetodoEnvio: string;
  idDireccionEnvio: number;
  costoEnvio: number;
  token: string;
  tag: string;
}) => {
  const response = await apiFetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_ENVIO_CARRITO}`, {
    method: "POST",
    token,
    body: JSON.stringify({
      tag,
      msgRequest,
      msgResponse,
      strDireccion,
      strMetodoEnvio,
      idDireccionEnvio,
      costoEnvio,
    }),
  });
  return safeResponseJson(response);
};

export const postPrepararPagoCarrito = async ({
  msgRequest,
  msgResponse,
  token,
  tag,
}: {
  msgRequest: any;
  msgResponse: any;
  token: string;
  tag: string;
}) => {
  const response = await apiFetch(`${API_ENDPOINT_CARRITO.POST_PREPARAR_PAGO_CARRITO}`, {
    method: "POST",
    token,
    body: JSON.stringify({ tag, msgRequest, msgResponse }),
  });
  return safeResponseJson(response);
};

export const postRegistrarPagoCarrito = async ({
  msgPago,
  token,
  tag,
}: {
  msgPago: any;
  token: string;
  tag: string;
}) => {
  const response = await apiFetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_PAGO_CARRITO}`, {
    method: "POST",
    token,
    body: JSON.stringify({ tag, msgPago }),
  });
  return safeResponseJson(response);
};

export const PostRegistrarDatosPreEnvioCarrito = async ({
  token,
  tag,
  msgRequest,
  msgResponse,
}: {
  token: string;
  tag: string;
  msgRequest: any;
  msgResponse: any;
}) => {
  await apiFetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_DATOS_PRE_ENVIO_CARRITO}`, {
    method: "POST",
    token,
    body: JSON.stringify({ tag, msgRequest, msgResponse }),
  });
};

export const PostRegistrarDatosEnvioCarrito = async ({
  token,
  tag,
  msgRequest,
  msgResponse,
}: {
  token: string;
  tag: string;
  msgRequest: any;
  msgResponse: any;
}) => {
  const response = await apiFetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_DATOS_ENVIO_CARRITO}`, {
    method: "POST",
    token,
    body: JSON.stringify({ tag, msgRequest, msgResponse }),
  });
  return safeResponseJson(response);
};

export const postRegistrarCotizacionEnvioCarrito = async ({
  token,
  tag,
  msgRequest,
  msgResponse,
  strDireccion,
  strMetodoEnvio,
  idDireccionEnvio,
  costoEnvio,
}: {
  token: string;
  tag: string;
  msgRequest: string;
  msgResponse: string;
  strDireccion: string;
  strMetodoEnvio: string;
  idDireccionEnvio: number;
  costoEnvio: number;
}) => {
  const response = await apiFetch(`${API_ENDPOINT_CARRITO.POST_REGISTRAR_COTIZACION}`, {
    method: "POST",
    token,
    body: JSON.stringify({
      tag,
      msgRequest: JSON.parse(msgRequest),
      msgResponse: JSON.parse(msgResponse),
      strDireccion,
      strMetodoEnvio,
      idDireccionEnvio,
      costoEnvio,
    }),
  });
  return safeResponseJson(response);
};
