export const ANDREANI_API_URL = "https://apisqa.andreani.com/v1/tarifas";
export const ANDREANI_CREDENTIALS = {
  usuario: "testinternoqa_gla",
  password: "iqVsIeR0q6voXcrs7HDV!",
};

export async function getAndreaniToken(): Promise<string | null> {
  // 🔧 TOKEN FORZADO PARA DESARROLLO - Cambia esto a false para usar autenticación real
  const USE_FIXED_TOKEN = true;
  const FIXED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZjlkY2FiMS00ZGI2LTRiMDMtYmViYS1mNGU0MWNkZDU5ZWEiLCJ1c2VyTmFtZSI6InRlc3RpbnRlcm5vcWFfZ2xhIiwiZ3JvdXBJZCI6ImE0MWMyNTZiLWQ0YzctNGJjMS05MDkyLWMzYWRlZDljMzkxYyIsImlhdCI6MTc2MDYxNDIwNiwiZXhwIjoxNzYwNzAwNjA2fQ.T0NJG2K2AXVg2PO7FYTYLpKqRyVFqlNl_fpqYHCkFvA";

  if (USE_FIXED_TOKEN) {
    return FIXED_TOKEN;
  }

  // Autenticación normal
  try {
    const response = await fetch("https://apisqa.andreani.com/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ANDREANI_CREDENTIALS),
    });

    if (!response.ok) {
      console.error("Error al autenticar con Andreani:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.token || data.access_token || null;
  } catch (error) {
    console.error("Error en autenticación Andreani:", error);
    return null;
  }
}

export async function getCotizacion({ cpDestino, contrato, cliente, volumen }: { cpDestino: string; contrato: string; cliente: string; volumen: string; }) {
  const tokenAdreani = await getAndreaniToken();
  const url = new URL(ANDREANI_API_URL);
  url.searchParams.append("cpDestino", cpDestino);
  url.searchParams.append("contrato", contrato);
  url.searchParams.append("cliente", cliente);
  url.searchParams.append("bultos[0][volumen]", volumen);
  // url.searchParams.append("codigoPostalDestino", "5257");


  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${tokenAdreani}`,
    },
  });

  const data = await response.json();
  return data;

}

const ANDREANI_SUCURSALES_URL = "https://apisqa.andreani.com/v2/sucursales";



interface Direccion {
  calle: string;
  numero: string;
  provincia: string;
  localidad: string;
  region: string;
  pais: string;
  codigoPostal: string;
}

interface Coordenadas {
  latitud: string;
  longitud: string;
}

interface DatosAdicionales {
  seHaceAtencionAlCliente: boolean;
  tipo: string;
  admiteEnvios: boolean;
  entregaEnvios: boolean;
  conBuzonInteligente: boolean;
}


interface Sucursal {
  id: number;
  idgla_integra: number;
  idgla_alertran: number;
  codigo: string;
  numero: string;
  descripcion: string;
  canal: string;
  direccion: Direccion;
  coordenadas: Coordenadas;
  horarioDeAtencion: string;
  datosAdicionales: DatosAdicionales;
  telefonos: string[];
  codigosPostalesAtendidos: string[] | null;
}

export async function getSucursales() {
  try {
    const response = await fetch(ANDREANI_SUCURSALES_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          error: "Error al obtener las sucursales",
          data: []
        },
        { status: response.status }
      );
    }

    const sucursales: Sucursal[] = await response.json();

    // Filtrar solo sucursales con coordenadas básicas (sin validación de rangos)
    const sucursalesConCoordenadas = sucursales.filter(
      (sucursal) =>
        sucursal.coordenadas &&
        sucursal.coordenadas.latitud &&
        sucursal.coordenadas.longitud &&
        sucursal.direccion &&
        sucursal.direccion.calle
    );

    const totalSucursales = sucursales.length;
    const sucursalesValidas = sucursalesConCoordenadas.length;
    const sucursalesInvalidas = totalSucursales - sucursalesValidas;

    return Response.json({
      success: true,
      data: sucursalesConCoordenadas,
      total: sucursalesValidas,
      totalRecibidas: totalSucursales,
      invalidas: sucursalesInvalidas
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Error al conectar con el servidor de Andreani",
        data: []
      },
      { status: 500 }
    );
  }
}



export const postCrearOrdenEnvio = async () => {

  const jsont = {
    "estado": "Pendiente",
    "tipo": "B2C",
    "sucursalDeDistribucion": {
      "nomenclatura": "BAR",
      "descripcion": "BARRACAS",
      "id": "3"
    },
    "sucursalDeRendicion": {
      "nomenclatura": "PPB",
      "descripcion": "PROVEEDOR CABA",
      "id": "171"
    },
    "sucursalDeImposicion": {},
    "sucursalAbastecedora": {},
    "fechaCreacion": "2025-10-23T15:37:57-03:00",
    "numeroDePermisionaria": "RNPSP Nº 586",
    "descripcionServicio": "Encomienda eCommerce",
    "bultos": [
      {
        "numeroDeBulto": "1",
        "numeroDeEnvio": "360000101539859",
        "totalizador": "1/1",
        "linking": [
          {
            "meta": "Etiqueta",
            "contenido": "https://apisqa.andreani.com/v2/ordenes-de-envio/API0000000417771/etiquetas?bulto=1"
          }
        ]
      }
    ],
    "agrupadorDeBultos": "API0000000417771",
    "etiquetasPorAgrupador": "https://apisqa.andreani.com/v2/ordenes-de-envio/API0000000417771/etiquetas"
  }

  const token = await getAndreaniToken();

  if (!token) {
    throw new Error("No se pudo obtener el token de autenticación de Andreani");
  }

  const response = await fetch(`https://apisqa.andreani.com/v2/ordenes-de-envio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Connection" : "keep-alive",
      "Accept-Encoding" : "gzip, deflate, br",
      "Accept" : "*/*",
      "x-authorization-token": `Bearer ${token}`
    },
    body: JSON.stringify(jsont)
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error al crear la orden de envío:", errorMessage);
    throw ("Fallo la creacion de la orden de envío");
  }

  const result = await response.json();
  return result;

}