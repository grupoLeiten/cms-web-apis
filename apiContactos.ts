import { API_ENDPOINT_CONTACTOS } from "./apiConfig";

export const postLoginFromContacto = async ({ email, passWord, token }: { email: string, passWord: string, token: string }) => {

    const body = {
        "mail": email,
        "passWord": passWord,
        "token": token

    }
    const bodyJson = JSON.stringify(body);

    const response = await fetch(`${API_ENDPOINT_CONTACTOS.POST_LOGIN_FROM_CONTACTO}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: bodyJson
        }
    );


    const data = await response.json();
    return data;

}

export const postGetDireccion = async ({ idCliente, idContacto, token }: { idCliente: string, idContacto: string, token: string }) => {


    const response = await fetch(`${API_ENDPOINT_CONTACTOS.GET_DIRECCION_DE_ENTREGA_CLIENTE_CONTACTO}?IdContacto=${idContacto}&IdCliente=${idCliente}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
        }
    );


    const data = await response.json();
    return data[0];

}

export const postCrearContactoDireccionEntrega = async ({
    idContacto,
    idCliente,
    codPos,
    strCiudad,
    strProvincia,
    localidad,
    numero,
    calle,
    loteo,
    lng,
    lat,
    direccionGeolocalizada,
    direccionValidadPorGeolocalizacion,
    direccionValidadaPorPin,
    token
}: {
    idContacto: number,
    idCliente: number,
    codPos: string,
    strCiudad: string,
    strProvincia: string,
    localidad: string,
    numero: string,
    calle: string,
    loteo: string,
    lng: number,
    lat: number,
    direccionGeolocalizada: boolean,
    direccionValidadPorGeolocalizacion: boolean,
    direccionValidadaPorPin: boolean,
    token: string
}) => {

    const body = {
        idContacto,
        idCliente,
        codPos,
        strCiudad,
        strProvincia,
        localidad,
        numero,
        calle,
        loteo,
        lng,
        lat,
        direccionGeolocalizada,
        direccionValidadPorGeolocalizacion,
        direccionValidadaPorPin
    };

    const bodyJson = JSON.stringify(body);

    const response = await fetch(`${API_ENDPOINT_CONTACTOS.POST_CREAR_DIRECCION_DE_ENTREGA_CLIENTE_CONTACTO}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: bodyJson
        }
    );

    if (!response.ok) {
        return { success: false, error: "Error al crear la dirección de entrega" };
    }

    return { success: true };
}





export const GetTiposInscripcionParaFacturar = async ({ request, token }: { request: Request, token: string }) => {


    const response = await fetch(`${API_ENDPOINT_CONTACTOS.GET_TIPOS_INCRIPCIONES_PARA_FACTURAR}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });

    const listaTiposInscripcion = await response.json();

    if (!response.ok) {
        return [];
    }

    return listaTiposInscripcion;
}



export async function postRegisterFromContacto(data: {
    nombre: string;
    apellido: string;
    tipDoc: string;
    nroDoc: string;
    mail: string;
    codPos: string;
    strProvincia: string;
    localidad: string;
    numero: string;
    calle: string;
    loteo: string;
    lng: number;
    lat: number;
    direccionGeolocalizada: boolean;
    direccionValidadPorGeolocalizacion: boolean;
    direccionValidadaPorPin: boolean;
    razonSocial: string;
    nroDocFacturacion: string;
    tipDocFacturacion: string;
    telefonoContacto: string;
    urlConfirmacion: string;
    passWord: string;
},
    token: string): Promise<any> {


    const body = {
        "nombre": data.nombre,
        "apellido": data.apellido,
        "tipDoc": data.tipDoc,
        "nroDoc": data.nroDoc,
        "mail": data.mail,
        "codPos": data.codPos,
        "strProvincia": data.strProvincia,
        "localidad": data.localidad,
        "numero": data.numero,
        "calle": data.calle,
        "loteo": data.loteo,
        "lng": data.lng,
        "lat": data.lat,
        "direccionGeolocalizada": data.direccionGeolocalizada,
        "direccionValidadPorGeolocalizacion": data.direccionValidadPorGeolocalizacion,
        "direccionValidadaPorPin": data.direccionValidadaPorPin,
        "razonSocial": data.razonSocial,
        "nroDocFacturacion": data.nroDocFacturacion,
        "tipDocFacturacion": data.tipDocFacturacion,
        "telefonoContacto": data.telefonoContacto,
        "urlConfirmacion": data.urlConfirmacion,
        "passWord": data.passWord
    }

    const bodyJson = JSON.stringify(body);

    const response = await fetch(`${API_ENDPOINT_CONTACTOS.POST_CREAR_CONTACTO}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: bodyJson
        }
    );

    const responseData = await response.json();

    return responseData;

}

export const postConfirmarContacto = async ({ token, tokenParametro }: { token: string, tokenParametro: string | undefined }) => {

    const response = await fetch(`${API_ENDPOINT_CONTACTOS.PORT_CONFIRMAR_CONTACTO}?tokenParametro=${tokenParametro}`, {
        method: "POST",
        headers: {
            "Authorization": token || ""
        }
    });

    if (!response.ok) {
        return { success: false, error: "Error al confirmar el contacto" };
    }

    return { success: true };
}


export const getSetClienteSession = async ({ token, idContacto, idCliente }: { token: string, idContacto: string, idCliente: string }) => {


    await fetch(`${API_ENDPOINT_CONTACTOS.GET_SET_CLIENTE_SESSION}?idContacto=${idContacto}&idCliente=${idCliente}&&token=${token}`, {
        method: "GET",
        headers: {
            "Authorization": token
        }
    });

    return { success: true };
}

export const postSendMailAutenticacion = async ({ 
    token, 
    queryParams 
}: { 
    token: string, 
    queryParams?: Record<string, string> 
}) => {
    try {
        let url = `${API_ENDPOINT_CONTACTOS.POST_SEND_MAIL_AUTENTICACION}`;
        
        // Agregar query parameters si existen
        if (queryParams && Object.keys(queryParams).length > 0) {
            const searchParams = new URLSearchParams(queryParams);
            url += `?${searchParams.toString()}`;
        }

     
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

     
        // Si la respuesta es 200, consideramos éxito sin importar si hay JSON o no
        if (response.ok) {
            // Intentar parsear JSON si existe, si no, retornar éxito de todas formas
            try {
                const textResponse = await response.text();
                
                if (textResponse.trim() === "") {
                    return { success: true, data: {} };
                }
                
                const data = JSON.parse(textResponse);
                return { success: true, data };
            } catch (e) {
                // Si no hay JSON, igual es éxito (el backend solo responde 200)
                return { success: true, data: {} };
            }
        }

        // Si no es 200, manejar el error
        console.log("ERROR: Status no es 200");
        let errorMessage = "Error al enviar el mail de autenticación";
        try {
            const textError = await response.text();
            console.log("Body de error (texto):", textError);
            try {
                const errorData = JSON.parse(textError);
                console.log("Body de error (JSON parseado):", errorData);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = textError || errorMessage;
            }
        } catch (e) {
            console.log("Error al obtener texto de respuesta:", e);
        }
        console.log("Mensaje de error final:", errorMessage);
        console.log("=== FIN LOG POST_SEND_MAIL_AUTENTICACION ===");
        return { 
            success: false, 
            error: errorMessage
        };
    } catch (error: any) {
        console.log("=== EXCEPCIÓN EN POST_SEND_MAIL_AUTENTICACION ===");
        console.log("Error:", error);
        console.log("Error message:", error?.message);
        console.log("=== FIN EXCEPCIÓN ===");
        return { 
            success: false, 
            error: error?.message || "Error de conexión al enviar el mail de autenticación" 
        };
    }
}

export const postLoginFromClaveAutenticacion = async ({ 
    token, 
    mail,
    clave
}: { 
    token: string, 
    mail: string,
    clave: string
}) => {
    try {
        let url = `${API_ENDPOINT_CONTACTOS.POST_LOGIN_FROM_CLAVE_AUTENTICACION}`;
        
        // Agregar query parameters
        const searchParams = new URLSearchParams({
            mail: mail,
            clave: clave
        });
        url += `?${searchParams.toString()}`;

        console.log("=== LOG POST_LOGIN_FROM_CLAVE_AUTENTICACION ===");
        console.log("URL completa:", url);
        console.log("Mail:", mail);
        console.log("Clave:", clave ? "***" : "No proporcionada");
        console.log("Token:", token ? `${token.substring(0, 20)}...` : "No token");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        console.log("Status de respuesta:", response.status);
        console.log("Status OK:", response.ok);
        console.log("Headers de respuesta:", Object.fromEntries(response.headers.entries()));

        // Si la respuesta es 200, consideramos éxito
        if (response.ok) {
            try {
                const textResponse = await response.text();
                console.log("Body de respuesta (texto):", textResponse);
                
                if (textResponse.trim() === "") {
                    console.log("Respuesta vacía, considerando éxito");
                    return { success: true, data: {} };
                }
                
                const data = JSON.parse(textResponse);
                console.log("Body de respuesta (JSON parseado):", data);
                console.log("=== FIN LOG POST_LOGIN_FROM_CLAVE_AUTENTICACION ===");
                return { success: true, data };
            } catch (e) {
                console.log("Error al parsear JSON (pero status es 200):", e);
                console.log("=== FIN LOG POST_LOGIN_FROM_CLAVE_AUTENTICACION ===");
                return { success: true, data: {} };
            }
        }

        // Si no es 200, manejar el error
        console.log("ERROR: Status no es 200");
        let errorMessage = "Error al validar la clave de autenticación";
        try {
            const textError = await response.text();
            console.log("Body de error (texto):", textError);
            try {
                const errorData = JSON.parse(textError);
                console.log("Body de error (JSON parseado):", errorData);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = textError || errorMessage;
            }
        } catch (e) {
            console.log("Error al obtener texto de respuesta:", e);
        }
        console.log("Mensaje de error final:", errorMessage);
        console.log("=== FIN LOG POST_LOGIN_FROM_CLAVE_AUTENTICACION ===");
        return { 
            success: false, 
            error: errorMessage
        };
    } catch (error: any) {
        console.log("=== EXCEPCIÓN EN POST_LOGIN_FROM_CLAVE_AUTENTICACION ===");
        console.log("Error:", error);
        console.log("Error message:", error?.message);
        console.log("=== FIN EXCEPCIÓN ===");
        return { 
            success: false, 
            error: error?.message || "Error de conexión al validar la clave de autenticación" 
        };
    }
}