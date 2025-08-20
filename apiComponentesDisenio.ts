import { getSession } from "~/servicies/session.server";
import { API_ENDPOINT_COMPONENTES_DISENIO } from "./apiConfig";



export const getComponenteByCodigo = async ({ request, codigo }: { request: Request, codigo: string }) => {

    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    const userId = session.get("userId");
    const { name, token } = JSON.parse(userId || "{}");

    const response = await fetch(`${API_ENDPOINT_COMPONENTES_DISENIO.GET_BY_CODIGO}/Codigo/${codigo}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });

    const dataComponenteStyle = await response.json();

    return { dataComponenteStyle };
}
