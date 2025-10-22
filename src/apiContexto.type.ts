export interface MenuItem {
    id: number;
    nombre: string;
    url?: string;
    icono?: string;
    activo: boolean;
    orden?: number;
    submenu?: MenuItem[];
}

export type GetMainMenuResponse = MenuItem[];
