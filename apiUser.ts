import { isClientLoggedIn, getSelectedClient, getUserSession } from "~/servicies/userSession";

export const apiUser = async ({ request }: { request: Request }) => {
    const hasClients = await isClientLoggedIn(request);
    const selectedClient = await getSelectedClient(request);

    return { 
        isClientLoggedIn: hasClients, 
        client: selectedClient?.nombre 
    }
}

export const apiUserSelect = async ({  token, params, request }: { token: string, params: any, request: Request }) => {
    const { dataGetUserSession } = await getUserSession({ request });
    

    const [name = "", ...rest] = (dataGetUserSession?.contacto?.nombre || "").split(" ");
    const surname = rest.join(" ");
    
    return { 
        userData: { ...dataGetUserSession, name, surname }, 
        currentUrl: request.url 
    };
}