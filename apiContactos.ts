import { API_ENDPOINT_CONTACTOS } from "./apiConfig";
import { apiFetch } from "./apiClient";

export const postLoginFromContacto = async ({
  email,
  passWord,
  token,
}: {
  email: string;
  passWord: string;
  token: string;
}) => {
  const response = await apiFetch(`${API_ENDPOINT_CONTACTOS.POST_LOGIN_FROM_CONTACTO}`, {
    method: "POST",
    token,
    body: JSON.stringify({ mail: email, passWord, token }),
  });
  return response.json();
};

export const postGetDireccion = async ({
  idCliente,
  idContacto,
  token,
}: {
  idCliente: string;
  idContacto: string;
  token: string;
}) => {
  const response = await apiFetch(
    `${API_ENDPOINT_CONTACTOS.GET_DIRECCION_DE_ENTREGA_CLIENTE_CONTACTO}?IdContacto=${idContacto}&IdCliente=${idCliente}`,
    { method: "POST", token }
  );
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
};

export const postGetDirecciones = async ({
  idCliente,
  idContacto,
  token,
}: {
  idCliente: string;
  idContacto: string;
  token: string;
}) => {
  const response = await apiFetch(
    `${API_ENDPOINT_CONTACTOS.GET_DIRECCION_DE_ENTREGA_CLIENTE_CONTACTO}?IdContacto=${idContacto}&IdCliente=${idCliente}`,
    { method: "POST", token }
  );
  const data = await response.json();
  return data;
};

export const postCrearContactoDireccionEntrega = async ({
    idContacto,
    idCliente,
    codPos,
    strCiudad,
    strProvincia,
    localidad,
    numero,
    calle,
    loteo,
    lng,
    lat,
    direccionGeolocalizada,
    direccionValidadPorGeolocalizacion,
    direccionValidadaPorPin,
    token
}: {
    idContacto: number,
    idCliente: number,
    codPos: string,
    strCiudad: string,
    strProvincia: string,
    localidad: string,
    numero: string,
    calle: string,
    loteo: string,
    lng: number,
    lat: number,
    direccionGeolocalizada: boolean,
    direccionValidadPorGeolocalizacion: boolean,
    direccionValidadaPorPin: boolean,
    token: string
}) => {

    const body = {
        idContacto,
        idCliente,
        codPos,
        strCiudad,
        strProvincia,
        localidad,
        numero,
        calle,
        loteo,
        lng,
        lat,
        direccionGeolocalizada,
        direccionValidadPorGeolocalizacion,
        direccionValidadaPorPin
    };

    const response = await apiFetch(
        `${API_ENDPOINT_CONTACTOS.POST_CREAR_DIRECCION_DE_ENTREGA_CLIENTE_CONTACTO}`,
        { method: "POST", token, body: JSON.stringify(body) }
    );
    return response.json();
}





export const GetTiposInscripcionParaFacturar = async ({
  request,
  token,
}: {
  request: Request;
  token: string;
}) => {
  const response = await apiFetch(
    `${API_ENDPOINT_CONTACTOS.GET_TIPOS_INCRIPCIONES_PARA_FACTURAR}`,
    { method: "GET", token }
  );
  const listaTiposInscripcion = await response.json();
  return {dataListaTiposInscripcion: listaTiposInscripcion};
};



export async function postRegisterFromContacto(data: {
    nombre: string;
    apellido: string;
    tipDoc: string;
    nroDoc: string;
    mail: string;
    codPos: string;
    strProvincia: string;
    localidad: string;
    numero: string;
    calle: string;
    loteo: string;
    lng: number;
    lat: number;
    direccionGeolocalizada: boolean;
    direccionValidadPorGeolocalizacion: boolean;
    direccionValidadaPorPin: boolean;
    razonSocial: string;
    nroDocFacturacion: string;
    tipDocFacturacion: string;
    telefonoContacto: string;
    urlConfirmacion: string;
    passWord: string;
},
    token: string): Promise<any> {


    const body = {
        "nombre": data.nombre,
        "apellido": data.apellido,
        "tipDoc": data.tipDoc,
        "nroDoc": data.nroDoc,
        "mail": data.mail,
        "codPos": data.codPos,
        "strProvincia": data.strProvincia,
        "localidad": data.localidad,
        "numero": data.numero,
        "calle": data.calle,
        "loteo": data.loteo,
        "lng": data.lng,
        "lat": data.lat,
        "direccionGeolocalizada": data.direccionGeolocalizada,
        "direccionValidadPorGeolocalizacion": data.direccionValidadPorGeolocalizacion,
        "direccionValidadaPorPin": data.direccionValidadaPorPin,
        "razonSocial": data.razonSocial,
        "nroDocFacturacion": data.nroDocFacturacion,
        "tipDocFacturacion": data.tipDocFacturacion,
        "telefonoContacto": data.telefonoContacto,
        "urlConfirmacion": data.urlConfirmacion,
        "passWord": data.passWord
    }

    const bodyJson = JSON.stringify(body);

    const response = await apiFetch(`${API_ENDPOINT_CONTACTOS.POST_CREAR_CONTACTO}`, {
        method: "POST",
        token,
        body: bodyJson
    });
    return response.json();
}

export const postConfirmarContacto = async ({
  token,
  tokenParametro,
}: {
  token: string;
  tokenParametro: string | undefined;
}) => {
  const response = await apiFetch(
    `${API_ENDPOINT_CONTACTOS.PORT_CONFIRMAR_CONTACTO}?tokenParametro=${tokenParametro}`,
    { method: "POST", token: token || "" }
  );
  return response.json();
};


export const getSetClienteSession = async ({
  token,
  idContacto,
  idCliente,
}: {
  token: string;
  idContacto: string;
  idCliente: string;
}) => {
  const response = await apiFetch(
    `${API_ENDPOINT_CONTACTOS.GET_SET_CLIENTE_SESSION}?idContacto=${idContacto}&idCliente=${idCliente}&&token=${token}`,
    { method: "GET", token }
  );
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

export const postSendMailAutenticacion = async ({
  token,
  queryParams,
}: {
  token: string;
  queryParams?: Record<string, string>;
}) => {
  let url = `${API_ENDPOINT_CONTACTOS.POST_SEND_MAIL_AUTENTICACION}`;
  if (queryParams && Object.keys(queryParams).length > 0) {
    url += `?${new URLSearchParams(queryParams).toString()}`;
  }
  const response = await apiFetch(url, { method: "POST", token });
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const postLoginFromClaveAutenticacion = async ({
  token,
  mail,
  clave,
}: {
  token: string;
  mail: string;
  clave: string;
}) => {
  const url = `${API_ENDPOINT_CONTACTOS.POST_LOGIN_FROM_CLAVE_AUTENTICACION}?${new URLSearchParams({ mail, clave }).toString()}`;
  const response = await apiFetch(url, { method: "POST", token });
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};