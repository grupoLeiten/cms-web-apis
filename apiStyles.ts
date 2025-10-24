
//CONFIG
import { API_ENDPOINT_STYLES } from "~/cms-web-apis/apiConfig";
import { getSession } from "~/servicies/session.server";
//SESION
function isJsonParseable(str: string): boolean {
    try {
        JSON.parse(str);
        return true;
    } catch {
        return false;
    }
}

export const getStylesVista = async ({ params, token }: { params: any, token: string }) => {

    const idView = params.idView;
    const response = await fetch(`${API_ENDPOINT_STYLES.GET_STYLE_VISTA}/IdVista/${idView}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });


    const stylessData = await response.text();
    const manipular = JSON.parse(stylessData);

    let styleObject2 = manipular.styleContent
    while (isJsonParseable(styleObject2)) {
        styleObject2 = JSON.parse(styleObject2);
    }

    const style = { styleObject: styleObject2, importString: manipular.importContent };
    return style;

}

export const setStylesVista = async ({ request, params, stylesObject, importString }: { request: Request, params: any, stylesObject: any, importString: any }) => {
    const cookie = request.headers.get("Cookie");
    const session = await getSession(cookie);
    const userId = session.get("userId");
    const { name, token } = JSON.parse(userId || "{}");


    const idView = params.idView;

    const body = JSON.stringify({ styleContent: JSON.stringify(stylesObject) || "", importContent: importString })

    const response = await fetch(`${API_ENDPOINT_STYLES.SET_STYLE_VISTA}/IdVista/${idView}`, {

        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: body
    });



    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }

    return { success: true };
}
