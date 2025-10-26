import { API_ENDPOINT_CONTACTOS, API_ENDPOINT_PROVINCIAS } from "./apiConfig";

export const postLoginFromContacto = async ({ email, passWord, token }: { email: string, passWord: string, token: string }) => {

    const body = {
        "mail": email,
        "passWord": passWord
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
    direccionValidadPorGeolocalizacion ,
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

    const data = await response.json();
    return data;
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
    passWord : string;
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