import { parseI18nMeta } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
import { Producto } from '../models/producto';
import { ProductoService } from '../productoService';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})
export class ListaProductosComponent implements OnInit {

  productos: Producto[];

  verLista: boolean;
  verListaProductos: boolean;
  verUnaMesaBool: boolean;



  constructor(private productoService: ProductoService) { 
    this.productos = []; //estoy inicializando la lista a vacia
    this.verLista = false;
    this.verListaProductos = false;
    this.verUnaMesaBool = false;

  }

  ngOnInit(): void {
  }

  VerListaProducto(): void{
    let p1:Producto = {
      id: 1,
      numeroProducto: 10,
      nombre: 'cafe chico', 
      precio: 100
    };
    let p2:Producto = {
      id: 2,
      numeroProducto: 20,
      nombre: 'cafe jarrita', 
      precio: 200
    };
    let p3:Producto = {
      id: 3,
      numeroProducto: 30,
      nombre: 'cafe grande', 
      precio: 300
    };

    this.productos.push(p1);
    this.productos.push(p2);
    this.productos.push(p3);
    console.log(this.productos);


    this.verListaProductos = !this.verListaProductos;
    this.productoService.getAllProductos().subscribe(productos => {
      this.productos = productos;
    });

  }


}
