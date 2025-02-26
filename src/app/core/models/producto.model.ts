import { Camion } from "./camion.model";

export interface Producto {
    id: number;
    nombre: string;
    camion: Camion;
}