import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MesaProductoService } from '../mesaProductoService';
import { mesaProductos } from '../models/mesaProducto';
import { Producto } from '../models/producto';
import { ProductoService } from '../productoService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  agregarProducto: FormGroup;
  numeroMesa: FormControl;
  numeroDeProducto: FormControl;
  detalleMesa: FormControl;
  fecha1Mesa: FormControl;
  fecha2Mesa: FormControl;


  verOcultar: string;
  productos: Producto[];
  mesas: mesaProductos[];
  mesasResumenes: mesaProductos[];
  mesaUnica: mesaProductos;

  abrirNuevaMesa: mesaProductos;
  productosAgregar: number[];
  listaProductos: Producto[];   // se usa para crear una nueva mesa
  listaProductos1: Producto[];  // se usa para la funcion, agregar un producto a la mesa
  listaProductos2: Producto[];

  falta modificar la funcion entera de ver las mesas abiertas

  chequear que las funciones crear mesa nueva y agregar productos funcione correctamente

  la variable listaProdductos2 NO esta en uso

  falta comentar el codigo y limpiarlo!


  verLista: boolean;
  verListaProductos: boolean;
  verUnaMesaBool: boolean;



  constructor(private servicioProducto: ProductoService,private servicioMesaProductos: MesaProductoService ,private fb: FormBuilder ) { 

    this.agregarProducto = this.fb.group({
      numeroProducto: '',
      nombre: '',
      precio: '',
    });

    this.mesas = new Array;
    this.mesasResumenes = new Array;
    this.productos = new Array;
    this.numeroMesa = new FormControl('');
    this.detalleMesa = new FormControl('');
    
    this.numeroDeProducto = new FormControl('');
    this.abrirNuevaMesa = new mesaProductos();
    this.fecha1Mesa = new FormControl('');
    this.fecha2Mesa = new FormControl('');

    this.verLista = false;
    this.verOcultar = "Ver";
    this.verListaProductos = false;
    this.verUnaMesaBool = false;

    this.productosAgregar = [];
    this.listaProductos = [];
    this.listaProductos1 = [];  
    this.listaProductos2 = [];
    this.mesaUnica = new mesaProductos();

  }

  ngOnInit() {
    this.servicioProducto.getAllProductos().subscribe(productos => {
      this.productos = productos;
    });

    this.servicioMesaProductos.getMesasAbiertas().subscribe(mesaAbiertas => {
      this.mesas = mesaAbiertas;
    });

    console.log("listaProducto2 = ", this.listaProductos2);

  }



/*
    * Oculta o muestra la lista de las mesas
  */
VerOcutalLista(): void{
  if(this.verLista){
    this.verLista = false;
    this.verOcultar = "Ver"
  }
  else{
    this.verLista = true;
    this.verOcultar = "Ocultar"
  }
}




  /*
    * VerMesasAbiertas, se mostraran todas las mesas abiertas
  */
  verMesasAbiertas(): void{
    this.servicioMesaProductos.getMesasAbiertas().subscribe(mesaAbiertas => {
      this.mesas = mesaAbiertas;
    });
  }





/*
  * FUNCION enviarServidorProductoAMesa
  * Agrega una mesa a la base de datos.
  * No recibe ningun argunmento.
  * No retorna ningun argumento.
*/
enviarAlServidorNuevaMesa(): void{
    this.mesaUnica.numero_mesa = this.numeroMesa.value;
    this.mesaUnica.listaProductos = this.listaProductos;
    this.mesaUnica.estado = true;
    this.mesaUnica.fecha = this.fecha1Mesa.value;
    this.mesaUnica.precioTotal = 0;
    this.mesaUnica.precioTemporal = 0;
    this.mesaUnica.formaDePago = "Efectivo";
    this.mesaUnica.detalle = this.detalleMesa.value;
    this.mesaUnica.productosCobrados = [];

  
  this.mesas.push(this.mesaUnica);
  this.servicioMesaProductos.postAbrirMesa(this.mesaUnica);

  this.numeroMesa = new FormControl('');
  this.numeroDeProducto = new FormControl('');
  this.fecha1Mesa = new FormControl('');
  this.listaProductos = [];
  this.mesaUnica = new mesaProductos();
  this.detalleMesa = new FormControl('');
}





/*
  * Funcion actualizar
  * Esta funcion agrega un producto a la mesa.
  * La variable j, ayuda a utilizar el break para parar el bucle
*/
actualizar(): void{
  let j: boolean = false;                
  for(let i: number = 0; i <= this.mesas.length; i++){
    if(this.numeroMesa.value == this.mesas[i].numero_mesa){
      for(let e: number = 0; e <= this.productos.length; e++){
        if(this.numeroDeProducto.value == this.productos[e].numeroProducto){
          this.mesas[i].listaProductos = [this.productos[e]].concat(this.mesas[i].listaProductos);
          this.mesas[i].precioTotal = this.mesas[i].precioTotal + this.productos[e].precio;
          this.servicioMesaProductos.postActualizar(this.mesas[i]);    
          j = true;
          break;   
        }
      }
    }
    if(j == true){
      break;
    }
  }
  this.numeroMesa = new FormControl('');
  this.numeroDeProducto = new FormControl('');
}



/*

listaDeProductos(): void{
  for(let e =0; e <= this.productos.length; e++){
    if(this.numeroDeProducto.value == this.productos[e].numeroProducto){
//    this.productos[e].cobrado = false;
      this.listaProductos2.push(this.productos[e]);
      console.log("ACTUALIZADO lista2=", this.listaProductos2);
      break;
    }

  }
}
*/



/*
*/
AgregarProductoaLaListaDeProductos(listaProductos_: Producto[]): Producto[]{
  for(let e =0; e <= this.productos.length; e++){
    if(this.numeroDeProducto.value == this.productos[e].numeroProducto){
      listaProductos_.push(this.productos[e]);
      console.log("ACTUALIZADO lista2=", listaProductos_);
      break;
    }
  }

  return listaProductos_;
}




/*
  * Esta funcion elimina un producto de la lista "productoLista2"
  * El array listaProducto2 es un array para guardar los distintos productos a guardar en una mesa
  * Luego ese array va a ser la lista de productos de una mesa
  * La funcion recibe como parametro el numero de id del producto
  * No retorna nada, actualiza el array listaProductos2
*/
eliminarProductoListaProducto(listaProductos_: Producto[], _$event: any): Producto[] {
//  console.log("$event", _$event.target.value, "\nlistaProducto2=", this.listaProductos2);
  for(let e =0; e <= listaProductos_.length; e++){
//    console.log("\n\nif", this.numeroDeProducto.value, " == ", this.productos[e].id);
    if(_$event.target.value == listaProductos_[e].id){
      listaProductos_.splice(0,1);
      break;
    }
  }
  console.log("listaProductos_: ", listaProductos_);
  return listaProductos_;
}













  /*
  */
  enviandoMuchosProductos(): void{
    for(let i in this.mesas){
      if(this.numeroMesa.value == this.mesas[i].id){
        this.mesas[i].listaProductos = this.listaProductos1.concat(this.mesas[i].listaProductos);
        this.mesas[i].precioTotal = 0;
        for(let e in this.mesas[i].listaProductos){
          this.mesas[i].precioTotal = this.mesas[i].precioTotal + this.mesas[i].listaProductos[e].precio;
        }     
        this.servicioMesaProductos.postActualizar(this.mesas[i]);
        console.log("enviando Muchos productos,", this.mesas[i]);
        break;
      } 
    }
    this.listaProductos1 = [];
    this.numeroMesa = new FormControl('');
    this.numeroDeProducto = new FormControl('');
  }




















/*
  * Esta funcion elimina un producto de la lista "productoLista2"
  * El array listaProducto2 es un array para guardar los distintos productos a guardar en una mesa
  * Luego ese array va a ser la lista de productos de una mesa
  * La funcion recibe como parametro el numero de id del producto
  * No retorna nada, actualiza el array listaProductos2
*/
eliminarProductoListaProducto2(_$event: any): void {
  console.log("$event", _$event.target.value, "\nlistaProducto2=", this.listaProductos2);
  for(let e =0; e <= this.listaProductos2.length; e++){
    console.log("\n\nif", this.numeroDeProducto.value, " == ", this.productos[e].id);
    if(_$event.target.value == this.listaProductos2[e].id){
      this.listaProductos2.splice(0,1);
      break;
    }
  }
  console.log("$event", _$event.target.value, "\nlistaProducto2=", this.listaProductos2);
}




/*
  */
agregarMuchosProductos(): void{
  for(var i in this.mesas){
    console.log("this.numeroMesa.value = ", this.numeroMesa.value, "\n", "this.mesas[i].id = ", this.mesas[i].id);
    if(this.numeroMesa.value == this.mesas[i].id){
      for(let e =0; e <= this.productos.length; e++){
        if(this.numeroDeProducto.value == this.productos[e].numeroProducto){
//          this.productos[e].cobrado = false;
          this.listaProductos2.push(this.productos[e]);
          console.log("ACTUALIZADO lista2=", this.listaProductos2);
          break;   
        }
      }
    }
  }
}














}
