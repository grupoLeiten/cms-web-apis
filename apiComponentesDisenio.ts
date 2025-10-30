import { getSession } from "~/servicies/session.server";
import { API_ENDPOINT_COMPONENTES_DISENIO } from "./apiConfig";



export const getComponenteByCodigo = async ({ request, codigo, token }: { request: Request, codigo: string, token: string }) => {

    const response = await fetch(`${API_ENDPOINT_COMPONENTES_DISENIO.GET_BY_CODIGO}/Codigo/${codigo}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });

    const dataComponenteStyle = await response.json();

    if (!response.ok) {
        return [];
    }

    return { dataComponenteStyle };
}
