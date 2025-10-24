import { API_ENDPOINT_PROVINCIAS } from "./apiConfig";

export const GetProvincias = async ({ request, token }: { request: Request, token: string }) => {


    const response = await fetch(`${API_ENDPOINT_PROVINCIAS.GET}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });

    const listaProvincias = await response.json();

    if (!response.ok) {
        return [];
    }

    return listaProvincias;
}
