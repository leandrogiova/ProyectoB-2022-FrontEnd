import { Component, OnInit } from '@angular/core';
import { Producto } from './models/producto';
import { ProductoService } from './productoService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Bar-FrontEnd';

  productos: Producto[];

  verListaProductos: boolean;



  constructor(private servicioProducto: ProductoService) { 

    this.verListaProductos = false;
    this.productos = new Array;
  }


  ngOnInit(): void {
    this.verListaProductos = !this.verListaProductos;
    this.servicioProducto.getAllProductos().subscribe(productos => {
      this.productos = productos;
    });
  }

  VerListaProducto(): void{
    this.verListaProductos = !this.verListaProductos;
    //this.servicioProducto.getAllProductos().subscribe(productos => {
    //  this.productos = productos;
    //});
  }



}
