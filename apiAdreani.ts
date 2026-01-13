// export const ANDREANI_API_URL = "https://apisqa.andreani.com/v1/tarifas";
export const ANDREANI_CREDENTIALS_QA = {
  usuario: "testinternoqa_gla",
  password: "iqVsIeR0q6voXcrs7HDV!",
};

const ANDREANI_CREDENCIALES_PRODUCTIVAS = {
  usuario: "leiten_gla",
  password : "y1k3DinIhSJdxDaJNnde@"
}

const URL_BASE_ADREANI = import.meta.env.VITE_API_BASE_URL_ADREANI


// Función helper para base64 que funciona en cliente y servidor
function encodeBase64(str: string): string {
  if (typeof btoa !== 'undefined') {
    // Navegador - usar btoa nativo
    return btoa(str);
  } else {
    // Node.js - usar Buffer
    return Buffer.from(str, 'utf8').toString('base64');
  }
}
export async function getAndreaniToken(): Promise<string | null> {
  // 🔧 TOKEN FORZADO PARA DESARROLLO - Cambia esto a false para usar autenticación real
  // const USE_FIXED_TOKEN = true;
  // const FIXED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZjlkY2FiMS00ZGI2LTRiMDMtYmViYS1mNGU0MWNkZDU5ZWEiLCJ1c2VyTmFtZSI6InRlc3RpbnRlcm5vcWFfZ2xhIiwiZ3JvdXBJZCI6ImE0MWMyNTZiLWQ0YzctNGJjMS05MDkyLWMzYWRlZDljMzkxYyIsImlhdCI6MTc2MDYxNDIwNiwiZXhwIjoxNzYwNzAwNjA2fQ.T0NJG2K2AXVg2PO7FYTYLpKqRyVFqlNl_fpqYHCkFvA";

  // if (USE_FIXED_TOKEN) {
  //   return FIXED_TOKEN;
  // }

  // Autenticación normal
  try {
    // Crear Basic Auth header
    const credentials = `${ANDREANI_CREDENCIALES_PRODUCTIVAS.usuario}:${ANDREANI_CREDENCIALES_PRODUCTIVAS.password}`;
    const base64Credentials = encodeBase64(credentials);

    const response = await fetch(`${URL_BASE_ADREANI}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "userName": ANDREANI_CREDENCIALES_PRODUCTIVAS.usuario,
        "password": ANDREANI_CREDENCIALES_PRODUCTIVAS.password
      }),
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
export async function getCotizacion({ cpDestino, volumen }: { cpDestino: string; contrato: string; cliente: string; volumen: string; }) {
  const tokenAdreani = await getAndreaniToken();
  const endpoint = `${import.meta.env.VITE_API_BASE_URL_ADREANI}/v1/tarifas`;
  const url = new URL(endpoint);
  url.searchParams.append("cpDestino", cpDestino);
  url.searchParams.append("contrato", "400006711");
  url.searchParams.append("cliente", "CL0003750");
  url.searchParams.append("bultos[0][volumen]", volumen);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${tokenAdreani}`,
    },
  });

  const data = await response.json();
  return data;

}

const ANDREANI_SUCURSALES_URL = `${import.meta.env.VITE_API_BASE_URL_ADREANI}/v2/sucursales`;

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
    const response = await fetch(`${URL_BASE_ADREANI}/v2/sucursales`, {
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

    return {
        success: true,
        sucursalesConCoordenadas,
        total: sucursalesValidas,
        totalRecibidas: totalSucursales,
        invalidas: sucursalesInvalidas,
    };

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



export const postCrearOrdenEnvio = async ({
  origen,
  destino,
  remitente,
  destinatario,
  remito,
  bultos
}: {
  origen: any
  destino: any,
  remitente: any,
  destinatario: any,
  remito: any,
  bultos: any
}) => {

  const jsont = {
    "contrato": "400006708",
    "origen": {
      "postal": {
        "codigoPostal": "3378",
        "calle": "Av Falsa",
        "numero": "380",
        "localidad": "PUERTO ESPERANZA 222",
      }
    },
    "destino": {
      "postal": {
        "codigoPostal": "1292",
        "calle": "Macacha Guemes",
        "numero": "28",
        "localidad": "CIUDAD AUTONOMA DE BUENOS AIRES",
        "componentesDeDireccion": [
          {
            "meta": "piso",
            "contenido": "2"
          },
          {
            "meta": "departamento",
            "contenido": "B"
          }
        ]
      }
    },
    "remitente": {
      "nombreCompleto": "Alberto Lopez",
      "telefonos": [
        {
          "tipo": 1,
          "numero": "113332244"
        }
      ]
    },
    "destinatario": [
      {
        "nombreCompleto": "Empresa SA",
        "telefonos": [
          {
            "tipo": 2,
            "numero": "153111231"
          }
        ]
      }
    ],
    "remito": {
      "numeroRemito": "123456789012R"
    },
    "bultos": [
      {
        "kilos": 2,
        "largoCm": 10,
        "altoCm": 50,
        "anchoCm": 10,
        "volumenCm": 5000,
        "valorDeclaradoSinImpuestos": 1200,
        "valorDeclaradoConImpuestos": 1452,
        "referencias": [
          {
            "meta": "detalle",
            "contenido": "Secador de pelo"
          },
          {
            "meta": "idCliente",
            "contenido": "10000"
          },
          {
            "meta": "observaciones",
            "contenido": "color negro"
          }
        ]
      }
    ]
  }



  const token = await getAndreaniToken();

  if (!token) {
    throw new Error("No se pudo obtener el token de autenticación de Andreani");
  }

  const response = await fetch(URL_BASE_ADREANI + "/v2/ordenes-de-envio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-authorization-token": `${token}`
    },
    body: JSON.stringify(jsont),
    
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error al crear la orden de envío:", errorMessage);
    throw ("Fallo la creacion de la orden de envío");
  }

  const result = await response.json();
  return result;

}


