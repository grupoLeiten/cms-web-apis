/**
 * Cliente API central - solo fetch, sin validación ni lógica de seguridad.
 * Devuelve la respuesta cruda; el backend es responsable de códigos y mensajes.
 */

export interface ApiClientOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: string | FormData;
  token?: string;
}

/**
 * Ejecuta fetch con headers mínimos. No valida response.ok.
 * @param endpoint - URL completa del endpoint
 * @param options - method, body, token, headers adicionales
 * @returns Response cruda (el consumidor decide qué hacer con status/errores)
 */
export async function apiFetch(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<Response> {
  const { method = "GET", headers = {}, body, token } = options;

  const defaultHeaders: Record<string, string> = {};
  if (body && typeof body === "string" && !(body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }
  if (token) {
    defaultHeaders["Authorization"] = token;
  }

  return fetch(endpoint, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body,
  });
}

/**
 * Ejecuta fetch y parsea JSON. No valida response.ok.
 * Útil cuando el consumidor necesita el body como objeto.
 * @returns El JSON parseado (o lanza si el body no es JSON válido)
 */
export async function apiFetchJson<T = unknown>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const response = await apiFetch(endpoint, options);
  return response.json() as Promise<T>;
}
