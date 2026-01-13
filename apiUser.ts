import { isClientLoggedIn, getSelectedClient } from "~/servicies/userSession";

export const apiUser = async ({ request }: { request: Request }) => {
    const hasClients = await isClientLoggedIn(request);
    const selectedClient = await getSelectedClient(request);

    return { 
        isClientLoggedIn: hasClients, 
        client: selectedClient?.nombre 
    }
}