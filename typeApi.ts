// ==========================================
// Tipos para las respuestas de las APIs
// ==========================================

// -- API Centros de Operaciones --
export interface IDataGetCentrosOperaciones {
    dataGetCentrosOperaciones: any[];
}

// -- API Content Settings (Footer) --
export interface IDataGetContenidoFichaSucursalItem {
    dataGetContenidoFichaSucursalItem: any[];
}

export interface IDataGetMenuGrid {
    dataGetMenuGrid: any;
}

// -- API Content Settings (Header) --
export interface IDataGetParametros {
    dataGetParametros: {
        action: string;
        noImageDefault: string | null;
        onGoToHomeAction: string;
        onSearchResultAction: string;
    };
}

export interface IDataGetListaDeObjetos {
    dataGetListaDeObjetos: any[];
}

export interface IDataGetMenu {
    dataGetMenu: {
        title: string;
        menus: any[];
        multimedia: boolean;
        chip: { textoToHome: string; actionHome: string };
    };
}

export interface IDataGetUrlDirectOnGoToHome {
    dataGetUrlDirectOnGoToHome: string;
}

export interface IDataGetUserSession {
    dataGetUserSession: {
        token: string;
        name?: string;
        contacto?: any;
        clientes?: any[];
    } | null;
}

// -- API Content Settings (HomePage) --
export interface IDataPostCarruselConfig {
    dataPostCarruselConfig: {
        arrows: boolean;
        activeView: number;
        automaticViewChange: boolean;
        automaticViewChangeInterval: number;
        endless: boolean;
        pageable: boolean;
        pagerOverlay: boolean;
        items: any[];
    };
}

export interface IDataGetBannersVista {
    dataGetBannersVista: any[];
}

export interface IDataGetVideosVista {
    dataGetVideosVista: any[] | null;
}

export interface IDataGetItems {
    dataGetItems: {
        products: any[];
        action: string;
    };
}

export interface IDataGetContenidoFichaItem {
    dataGetContenidoFichaItem: any;
}

// -- API Content Settings (ListFilterProduct) --
export interface IDataGetAtributosCMS {
    dataGetAtributosCMS: any;
}

// -- API Content Settings (DetailProduct) --
export interface IDataGetDetailProductData {
    dataGetDetailProductData: {
        dataCarrusel: any;
        tabPositions: any;
        itemModel: any;
        nombre: string;
        codigo: string;
        items: any[];
        itemBaseModel: any;
        templateNombre: any;
        templateCodigo: any;
        boxItems: any[];
        othersProps: any;
        action: string;
        noImageDefault: string | null;
        onSearchResultAction: string;
        idVista: string;
        idEntity: string;
    };
    redirectTo: string | null;
}

// -- API Style Layout --
export interface IDataGetStyleLayoutData {
    dataGetStyleLayoutData: {
        style: any;
        cssString: string;
        importsString: any;
        token: string;
        importStringShoppingCart: any;
        utmString: string;
        typePageInsider: string;
        currentUrl: string;
        product: any | null;
    };
}

