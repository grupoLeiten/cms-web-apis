//CONFIG DE LA API
import dotenv from 'dotenv';

dotenv.config();

export const API_BASE_URL = process.env.API_BASE_URL;
export const API_SERVICE_IMAGE_URL = process.env.VITE_SERVICE_API_IMAGE;



export const API_ENDPOINTS_CONTEXT = {
    POST: `${API_BASE_URL}/Contexto/Contexto/Login`,
    LOGOUT: `${API_BASE_URL}/Contexto/Contexto/LogOut`,
}

export const API_ENDPOINT_CONTACTOS = {
    POST_CREAR_CONTACTO: `${API_BASE_URL}/Contactos/ContactoCrear`,
    POST_LOGIN_FROM_CONTACTO: `${API_BASE_URL}/Contactos/LoginFromContacto`,
    GET_TIPOS_INCRIPCIONES_PARA_FACTURAR : `${API_BASE_URL}/Contactos/GetTiposInscripcionParaFacturar`,
    GET_DIRECCION_DE_ENTREGA_CLIENTE_CONTACTO : `${API_BASE_URL}/Contactos/GetDireccionesDeEntregaByClientesContacto`,
    POST_CREAR_DIRECCION_DE_ENTREGA_CLIENTE_CONTACTO : `${API_BASE_URL}/Contactos/ContactoDireccionEntregaCrear`,
    PORT_CONFIRMAR_CONTACTO : `${API_BASE_URL}/Contactos/ConfirmarContacto`,
    GET_SET_CLIENTE_SESSION: `${API_BASE_URL}/Contactos/SetClienteSession`,
    POST_SEND_MAIL_AUTENTICACION: `${API_BASE_URL}/Contactos/SendMailAutenticacion`,
    POST_LOGIN_FROM_CLAVE_AUTENTICACION: `${API_BASE_URL}/Contactos/LoginFromClaveAutenticacion`,
}

export const API_ENDPOINT_PROVINCIAS = {
    GET: `${API_BASE_URL}/Provincias/GetProvincias`,
}

export const API_ENDPOINTS_CONTENT_SETTEINGS = {
    GET_VISTA: `${API_BASE_URL}/ContentSettings/ContentSettings/GetVista`,
    GET_VISTAS: `${API_BASE_URL}/ContentSettings/ContentSettings/GetVistas`,
    MENU: `${API_BASE_URL}/ContentSettings/ContentSettings/GetMenu`,
    IMAGE: `${API_BASE_URL}/ContentSettings/GetImagen`,
    GET_CONTENIDO_FICHA_SUCURSAL_ITEM: `${API_BASE_URL}/ContentSettings/GetContenidoFichaSucursalItem`,
    POST_CARRUSEL: `${API_BASE_URL}/ContentSettings/GetCarruselConfig`,
    GET_BANNER_VISTA: `${API_BASE_URL}/ContentSettings/GetBannersVista`,
    GET_VIDOES_VISTA: `${API_BASE_URL}/ContentSettings/GetVideosVista`,
    GET_ITEMS: `${API_BASE_URL}/ContentSettings/GetItems`,
    GET_CONTENIDO_FICHA_ITEM: `${API_BASE_URL}/ContentSettings/GetContenidoFichaItem`,
    GET_ATRIBUTOS_CMS: `${API_BASE_URL}/ContentSettings/GetAtributosCMS`,
    GET_FICHA_PRODUCTO: `${API_BASE_URL}/ContentSettings/GetFichaProducto`,
    GET_IMAGEN_BY_ID_IMAGEN: `${API_BASE_URL}/ContentSettings/GetImagenByIdImagen`,
    GET_TIPOS_CONTENIDO1: `${API_BASE_URL}/ContentSettings/GetTiposContenido1`,
    GET_IMAGEN_AS_DOWNLOAD: `${API_BASE_URL}/ContentSettings/GetImagenAsDownload`,
    GET_ITEMS_BY_SEARCH_VIEW: `${API_BASE_URL}/ContentSettings/GetItemsBySearch`,
    MENU_GRID : `${API_BASE_URL}/ContentSettings/ContentSettings/GetMenuGrid`,
    LISTA_DE_OBJETOS : `${API_BASE_URL}/ContentSettings/GetListaDeObjetos`,
    GET_TEXTO_BY_CODIGO: `${API_BASE_URL}/ContentSettings/ContentSettings/GetTexto/Codigo`,
}

export const API_ENDPOINT_STYLES = {
    GET: `${API_BASE_URL}/Styles/GetStyle`,
    GET_STYLE_VISTA: `${API_BASE_URL}/Styles/GetStyleVista`,
    SET_STYLE_VISTA: `${API_BASE_URL}/Styles/SetStyleVista`,
    DELETE_STYLE_VISTA: `${API_BASE_URL}/Styles/DeleteStyleVista`,
}

export const API_ENDOPOINT_CENTROS_OPERACIONES = {
    GET_CENTROS_OPERACIONES: `${API_BASE_URL}/CentrosOperaciones/GetCentrosOperaciones`
}

export const API_ENDPOINTS_PRODUCTOS = {
    SEARCH: `${API_BASE_URL}/Productos/GetProductosBasePorBusquedaAmbigua`,
}


export const API_ENDPOINT_CARRITO = {
    GET : `${API_BASE_URL}/CarritoCompras/GetCarrito`,
    ACTUALIZAR : `${API_BASE_URL}/CarritoCompras/Actualizar`,
    REMOVEITEM : `${API_BASE_URL}/CarritoCompras/RemoveItem`,
    CLEAR : `${API_BASE_URL}/CarritoCompras/Clear`,
    ACTUALIZAR_ENVIO : `${API_BASE_URL}/CarritoCompras/SetEnvioCarrito`,
    //NUEVOS
    DELETE_CARRITO : `${API_BASE_URL}/CarritoCompras/CancelarPagoCarrito`,
    POST_PREPARAR_PAGO_CARRITO : `${API_BASE_URL}/CarritoCompras/PrepararPagoCarrito`,
    POST_REGISTRAR_ENVIO_CARRITO : `${API_BASE_URL}/CarritoCompras/RegistrarDatosEnvioCarrito`,
    POST_REGISTRAR_PAGO_CARRITO : `${API_BASE_URL}/CarritoCompras/RegitrarPagoCarrito`,
    GET_COMPONENTE_TO_VISTA : `${API_BASE_URL}/CarritoCompras/GetCarritoComponenteToVista`,
}


export const API_ENDPOINT_COMPONENTES_DISENIO = {
    GET_BY_CODIGO : `${API_BASE_URL}/CMSComponentesDiseno/GetComponenteByCodigo`,
}