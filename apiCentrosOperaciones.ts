//API
import { API_ENDOPOINT_CENTROS_OPERACIONES } from "~/cms-web-apis/apiConfig";
import { redirect } from "react-router";
//SESSION

export const getCentrosOperaciones = async ({ token }: { token: string }) => {
    // const cookie = request.headers.get("Cookie");
    // const session = await getSession(cookie);
    // const userId = session.get("userId");
    // const { name, token } = JSON.parse(userId || "{}");

    const response = await fetch(`${API_ENDOPOINT_CENTROS_OPERACIONES.GET_CENTROS_OPERACIONES}`, {
        headers: {
            "Authorization": token
        }
    });

    if (!response.ok) {
        return redirect("");
    }

    const centrosOperaciones = await response.json();
    return centrosOperaciones === undefined ? [{telefono : "1", nombre : "1", horario : "1"}] : centrosOperaciones;

}