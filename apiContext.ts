

import { redirect } from "react-router";
import { API_ENDPOINTS_CONTEXT } from "~/cms-web-apis/apiConfig";
//  import { commitSession, getSession } from "~/servicies/session.server";

export const getMapeoDominios = async ({ token }: { token?: string }) => {
    const response = await fetch(API_ENDPOINTS_CONTEXT.GET_MAPEO_DOMINIOS, {
        method: "GET",
        headers: token ? { Authorization: token } : {},
    });

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    return data;
};




// export async function tokenValid(token: string) {
//     // try {
//     //     const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_TIPOS_CONTENIDO1}`, {
//     //         method: "GET",
//     //         headers: {
//     //             "Authorization": token
//     //         }
//     //     });
//     //     return response.ok;
//     // } catch (err) {
//     //     console.error("Error en tokenValid:", err);
//     //     return false;
//     // }
//     return true;
// }



import { createAnonymousSessionAndRedirect } from "~/servicies/userSession";

export const getSignInAnonymous = async ({ request, route }: any) => {
    return await createAnonymousSessionAndRedirect(request, route);
}

// export const getSignInDepartamentoDesarrollo = async ({ request }: any) => {
//     const formData = await request.formData();
//     const name = formData.get("name");
//     const password = formData.get("password");

//     if (name !== "20630t" && name !== "20141t") {
//         return null;
//     }

//     const response = await fetch(`${API_ENDPOINTS_CONTEXT.POST}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             codUsr: name,
//             passWord: password,
//             loginAnonimo: false
//         }),
//     });

//     const result = await response.json();


//     if (!response.ok) {
//         return null;
//     }

//     const session = await getSession(
//         request.headers.get("Cookie"),
//     );

//     const userId = {
//         name: result.nomUsr,
//         token: result.sessionId,
//     };
//     session.set("userId", JSON.stringify(userId));
//     const cookieHeader = await commitSession(session);

//     return redirect(`/simularVista`, { headers: { "Set-Cookie": cookieHeader } });
// }