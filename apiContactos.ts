import { API_ENDPOINT_CONTACTOS } from "./apiConfig";

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
        "urlConfirmacion": data.urlConfirmacion
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