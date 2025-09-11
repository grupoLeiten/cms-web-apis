

// import { redirect } from "react-router";
import { API_ENDPOINTS_CONTENT_SETTEINGS, /* API_ENDPOINTS_CONTEXT */ } from "~/cms-web-apis/apiConfig";
//  import { commitSession, getSession } from "~/servicies/session.server";




export async function tokenValid(token: string) {
    try {
        const response = await fetch(`${API_ENDPOINTS_CONTENT_SETTEINGS.GET_TIPOS_CONTENIDO1}`, {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });
        return response.ok;
    } catch (err) {
        console.error("Error en tokenValid:", err);
        return false;
    }
}



// export const getSignInAnonymous = async ({ request, route }: any) => {

//     const response = await fetch(`${API_ENDPOINTS_CONTEXT.POST}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             codUsr: "",
//             passWord: "",
//             loginAnonimo: true
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
//     return redirect(route, { headers: { "Set-Cookie": cookieHeader } });
// }

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