import { API_ENDPOINT_COMPONENTES_DISENIO } from "./apiConfig";

export const getComponenteByCodigo = async ({ token, codigo }: { token: string, codigo: string }) => {

    const response = await fetch(`${API_ENDPOINT_COMPONENTES_DISENIO.GET_BY_CODIGO}/Codigo/${codigo}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });

    if (!response.ok) {
        return { dataComponenteStyle: [] };
    }

    const {dataComponenteStyle} = await response.json();

    return { dataComponenteStyle };
}
