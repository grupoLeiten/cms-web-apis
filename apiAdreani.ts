import {
  ANDREANI_BASE_URL,
  ANDREANI_USUARIO,
  ANDREANI_PASSWORD,
  ANDREANI_CLIENTE,
  ANDREANI_CONTRATO_DOMICILIO,
} from "./apiConfig";
import { apiFetch } from "./apiClient";

export async function getAndreaniToken(): Promise<string> {
  const usuario = ANDREANI_USUARIO;
  const password = ANDREANI_PASSWORD;
  if (!usuario || !password) {
    throw new Error("ANDREANI_USUARIO y ANDREANI_PASSWORD deben estar configurados en .env");
  }

  const response = await fetch(`${ANDREANI_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName: usuario, password }),
  });

  const data = await response.json();
  const token = data?.token ?? data?.access_token;
  if (!token) {
    throw new Error(`Andreani auth failed: ${response.status} ${JSON.stringify(data)}`);
  }
  return token;
}

export async function getCotizacion({
  cpDestino,
  contrato,
  cliente,
  volumen,
}: {
  cpDestino: string;
  contrato: string;
  cliente: string;
  volumen: string;
}) {
  const token = await getAndreaniToken();
  const contratoToUse = contrato || ANDREANI_CONTRATO_DOMICILIO;
  const clienteToUse = cliente || ANDREANI_CLIENTE;

  const url = new URL(`${ANDREANI_BASE_URL}/v1/tarifas`);
  url.searchParams.append("cpDestino", cpDestino);
  url.searchParams.append("contrato", contratoToUse);
  url.searchParams.append("cliente", clienteToUse);
  url.searchParams.append("bultos[0][volumen]", volumen);

  const response = await apiFetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.json();
}

export async function getSucursales() {
  const response = await apiFetch(`${ANDREANI_BASE_URL}/v2/sucursales`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  return response.json();
}

export async function postCrearOrdenEnvio({
  origen,
  destino,
  remitente,
  destinatario,
  remito,
  bultos,
}: {
  origen: any;
  destino: any;
  remitente: any;
  destinatario: any;
  remito: any;
  bultos: any;
}) {
  const token = await getAndreaniToken();
  const contrato = ANDREANI_CONTRATO_DOMICILIO;

  const body = {
    contrato,
    origen: { postal: origen },
    destino: {
      postal: {
        codigoPostal: destino.codPos,
        calle: destino.calle,
        numero: destino.numero || "28",
        localidad: destino.localidad,
      },
    },
    remitente: {
      nombreCompleto: remitente.nombreCompleto,
      telefonos: remitente.telefonos,
    },
    destinatario,
    remito: { numeroRemito: "" },
    bultos,
  };

  const response = await apiFetch(`${ANDREANI_BASE_URL}/v2/ordenes-de-envio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-authorization-token": token,
    },
    body: JSON.stringify(body),
  });

  return response.json();
}
