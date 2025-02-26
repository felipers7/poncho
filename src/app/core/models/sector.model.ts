import { Zona } from "./zona.model";

export interface Sector {
    id: number;
    descripcionSector: string;
    zona: Zona;
}
