import { Producto } from "./producto";

export class mesaProductos{

    id!: number;
    numero_mesa!: number;
    listaProductos!: Producto[];
    estado!: boolean;
    fecha!: Date;
    precioTotal!: number;
    precioTemporal!: number;
    formaDePago!: string;
    detalle!: string;
    productosCobrados!: Producto[];

/*
    constructor(id: number, numero_mesa:number, listaProductos: Producto[], precioTotal: number ,estado:boolean, fecha:Date, precioTemporal: number, formaDePago: string, detalle: string){
        this.id = id;
        this.numero_mesa = numero_mesa;
        this.listaProductos = listaProductos;
        this.estado = estado;
        this.fecha = fecha;
        this.precioTotal = precioTotal;
        this.precioTemporal = precioTemporal;
        this.formaDePago = formaDePago;
        this.detalle = detalle;
    }
*/
    constructor(){

    }


}