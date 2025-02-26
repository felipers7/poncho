import { Producto } from "./producto.model";

export interface Camion {
    id: number;
    nombre: string;
    productos: Producto[];
}