// URL base de Andreani desde variable de entorno
export const ANDREANI_BASE_URL = import.meta.env.VITE_API_BASE_URL_ADREANI || "https://apis.andreani.com";
export const ANDREANI_API_URL = `${ANDREANI_BASE_URL}/v1/tarifas`;
export const ANDREANI_CREDENTIALS = {
  userName: "leiten_gla",
  password: "y1k3DinIhSJdxDaJNnde@",
};

export async function getAndreaniToken(): Promise<string | null> {
  // Autenticación con Andreani
  const loginUrl = `${ANDREANI_BASE_URL}/login`;
  
  console.log("🔐 [Andreani Auth] Iniciando autenticación...");
  console.log("🔐 [Andreani Auth] URL Base:", ANDREANI_BASE_URL);
  console.log("🔐 [Andreani Auth] Login URL:", loginUrl);
  console.log("🔐 [Andreani Auth] Usuario:", ANDREANI_CREDENTIALS.userName);
  
  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ANDREANI_CREDENTIALS),
    });

    console.log("🔐 [Andreani Auth] Response status:", response.status);
    console.log("🔐 [Andreani Auth] Response statusText:", response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ [Andreani Auth] Error al autenticar:", response.status, response.statusText);
      console.error("❌ [Andreani Auth] Error body:", errorBody);
      return null;
    }

    const data = await response.json();
    console.log("✅ [Andreani Auth] Respuesta recibida:", JSON.stringify(data, null, 2));
    
    const token = data.token || data.access_token || null;
    if (token) {
      console.log("✅ [Andreani Auth] Token obtenido exitosamente (primeros 50 chars):", token.substring(0, 50) + "...");
    } else {
      console.error("❌ [Andreani Auth] No se encontró token en la respuesta. Keys disponibles:", Object.keys(data));
    }
    
    return token;
  } catch (error) {
    console.error("❌ [Andreani Auth] Error en autenticación:", error);
    return null;
  }
}

export async function getCotizacion({ cpDestino, contrato, cliente, volumen }: { cpDestino: string; contrato: string; cliente: string; volumen: string; }) {
  console.log("💰 [Andreani Cotizador] === INICIANDO COTIZACIÓN ===");
  console.log("💰 [Andreani Cotizador] cpDestino:", cpDestino);
  console.log("💰 [Andreani Cotizador] contrato:", contrato);
  console.log("💰 [Andreani Cotizador] cliente:", cliente);
  console.log("💰 [Andreani Cotizador] volumen:", volumen);
  
  const tokenAdreani = await getAndreaniToken();
  const url = new URL(ANDREANI_API_URL);
  url.searchParams.append("cpDestino", cpDestino);
  url.searchParams.append("contrato", contrato);
  url.searchParams.append("cliente", cliente);
  url.searchParams.append("bultos[0][volumen]", volumen);
  
  console.log("💰 [Andreani Cotizador] URL completa:", url.toString());

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${tokenAdreani}`,
    },
  });

  console.log("💰 [Andreani Cotizador] Response status:", response.status);
  
  const data = await response.json();
  console.log("💰 [Andreani Cotizador] Respuesta:", JSON.stringify(data, null, 2));
  
  return data;

}

const ANDREANI_SUCURSALES_URL = `${ANDREANI_BASE_URL}/v2/sucursales`;



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

  const response = await fetch(`${ANDREANI_BASE_URL}/v2/ordenes-de-envio`, {
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