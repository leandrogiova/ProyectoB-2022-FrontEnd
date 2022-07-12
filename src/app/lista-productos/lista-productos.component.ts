import { parseI18nMeta } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Producto } from '../models/producto';
import { ProductoService } from '../productoService';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})
export class ListaProductosComponent implements OnInit {


  productos: Producto[];
  agregarProducto: FormGroup;

  verLista: boolean;
  verListaProductos: boolean;
  verUnaMesaBool: boolean;



  constructor(private productoService: ProductoService, private fb: FormBuilder) { 
    this.productos = []; //estoy inicializando la lista a vacia
    this.verLista = false;

    this.agregarProducto = this.fb.group({
      numeroProducto: '',
      nombre: '',
      precio: '',
    });

    this.verListaProductos = false;
    this.verUnaMesaBool = false;

  }

  ngOnInit(): void {
  }

  VerListaProducto(): void{
    this.verListaProductos = !this.verListaProductos;
    this.productoService.getAllProductos().subscribe(productos => {
      this.productos = productos;
    });
  }





    /*
     * FUNCION enviarProducto
     * Agrega un producto a la bases de datos.
  */
    enviarProducto():void{
      this.productoService.postProducto(this.agregarProducto.value);
      console.log("Agregando el objeto",this.agregarProducto.value, "\nObjeto Agregado a la base de datos");
  
      this.agregarProducto = this.fb.group({
        numeroProducto: '',
        nombre: '',
        precio: '',
      });
    }




}
