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