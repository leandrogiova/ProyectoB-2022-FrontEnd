export class Producto {
    id: number;
    numeroProducto: number;
    nombre: string;
    precio: number;    
//    cobrado: boolean;

    constructor(id_: number, numeroProducto_: number, nombre_: string, precio_: number, cobrado: boolean){   
        this.id = id_;
        this.numeroProducto = numeroProducto_;
        this.nombre = nombre_;
        this.precio = precio_;    
//        this.cobrado = cobrado;

    }

}   