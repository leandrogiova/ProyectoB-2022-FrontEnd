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

//  falta modificar la funcion entera de ver las mesas abiertas

//  chequear que las funciones crear mesa nueva y agregar productos funcione correctamente

//  la variable listaProdductos2 NO esta en uso

//  falta comentar el codigo y limpiarlo!
//--------------------------------------------------
//falta revisar toda la funcion cobrar entera


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

    for(let e in this.mesaUnica.listaProductos){
      this.mesaUnica.precioTotal = this.mesaUnica.precioTotal + this.mesaUnica.listaProductos[e].precio;
    }

  
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
  * Esta funcion agrega un producto a una lista y retorna esa lista
  * Se utiliza tanto para abrir una nueva mesa como ver las mesas y agregar productos a la mesa
  * Recibe como parametro una lista de Productos y retorna esa lista de productos con el producto agregado
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
  * La funcion recibe como parametro una lista de productos y un producto
  * Retorna esa lista de productos sin el producto(que es ese segundo parametro de la funcion)
  * La funcion elimina el producto(el segundo parametro de la funcion) de la lista de prodcutos
  * que es el primer parametro de la funcion y retorna esa lista de productos sin ese producto.
*/
eliminarProductoListaProducto(listaProductos_: Producto[], _$event: any): Producto[] {
  for(let e =0; e <= listaProductos_.length; e++){
    if(_$event.target.value == listaProductos_[e].id){
      listaProductos_.splice(0,1);
      break;
    }
  }
  return listaProductos_;
}



/*
  * Esta funcion sirve para agregar mas productos a una mesa existente.
  * Primero va a buscar cual es la mesa a la cual se quieren agregar los productos(primer "for")
  * Y compara el id de la mesa.
  * numeroMesa.value que es un FormControl esta vez es el ID de la mesa.
  * NO ES EL NUMERO DE MESA
  * Una vez que se identifica a la mesa, a la lista de productos de la mesa se le agrega la nueva lista de productos
  * Y al final se envia la mesa al servidor para actualizar la base de datos
  * La funcion no recibe argumentos y no retorna nada.
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
      break;
    } 
  }
  this.listaProductos1 = [];
  this.numeroMesa = new FormControl('');
  this.numeroDeProducto = new FormControl('');
}



/*
  * verUnaMesa() sirve para desplegar una mesa con todos sus detalles y asi visualizarla para poder cobrarla y cerrar
  * La funcion hace un NOT a la variable booleana verunaMesaBool
  * Y iniciliza la variable mesaUnica con los detalles de la mesa que se quiere cobrar
  * No recibe parametros y no tiene ningun retorno
*/
verUnaMesa(): void{
  this.verUnaMesaBool = !this.verUnaMesaBool;
  for(let i: number = 0; i <= this.mesas.length; i++){
    if(this.numeroMesa.value == this.mesas[i].numero_mesa){
      this.mesaUnica = this.mesas[i];
      break;
    }
  }
  console.log("MesaUnica = ", this.mesaUnica);
}
  



/*
  * cobrarProducto cobra un producto agregando ese producto la lista "productosCobrados" de la mesa
  * El producto es pasado por parametro de la funcion
  * Ademas elimina el producto de la lista "listaProductos" de la mesa
  * Suma el precio del producto al precio temporal de la mesa, es decir, este es el precio ya pagado de la mesa
  * Envia la mesa al servidor para hacer una actualizacion de la base de datos
  * Recibe como pametro el numero del id del producto
  * No retorna ningun argumento
*/
cobrarProducto($event: any): void{
  for(let i: number = 0; i <= this.mesaUnica.listaProductos.length; i++){
    if($event.target.value == this.mesaUnica.listaProductos[i].id){
      this.mesaUnica.productosCobrados.push(this.mesaUnica.listaProductos[i]);
      this.mesaUnica.precioTemporal = this.mesaUnica.precioTemporal + this.mesaUnica.listaProductos[i].precio;
      this.mesaUnica.listaProductos.splice(i, 1);
      this.servicioMesaProductos.postActualizar(this.mesaUnica);
      break;
    }
  }
}




/*
  * deshacerCambioCobrarProducto elimina un producto de la lista "productosCobrados" de la mesa
  * El producto es pasado por parametro de la funcion
  * Ademas agrega el producto a la lista "listaProductos" de la mesa
  * Resta el precio del producto al precio temporal de la mesa
  * Envia la mesa al servidor para hacer una actualizacion de la base de datos
  * Recibe como pametro el numero del id del producto
  * No retorna ningun argumento
*/
deshacerCambioCobrarProducto($event: any){
  for(let i: number = 0; i <= this.mesaUnica.productosCobrados.length; i++){
    if($event.target.value == this.mesaUnica.productosCobrados[i].id){
      this.mesaUnica.listaProductos.push(this.mesaUnica.productosCobrados[i]);
      this.mesaUnica.precioTemporal = this.mesaUnica.precioTemporal - this.mesaUnica.listaProductos[i].precio;
      this.mesaUnica.productosCobrados.splice(i, 1);
      this.servicioMesaProductos.postActualizar(this.mesaUnica);
      break;
    }
  }
}


/*
  * cobrarCerrarMesa cierra una mesa, poniendo el estado de la mesa en false
  * Luego envia la mesa al servidor para actualizar el servidor
  * Y eliminar la mesa de la lista de mesas abiertas "mesas"
  * No recibe ningun parametro 
  * No retorna nada.
*/
cobrarCerrarMesa(): void{
  for(let i: number =0; i <= this.mesas.length; i++){
    if(this.mesas[i].id == this.mesaUnica.id){
      this.mesas[i].estado = false;
      this.mesas[i].precioTemporal = 0;
  //  this.mesas[i].listaProductos = [this.productos[e]].concat(this.mesas[i].listaProductos);
      this.mesas[i].listaProductos = this.mesas[i].listaProductos.concat(this.mesas[i].productosCobrados);
  //  this.mesas[i].listaProductos = [this.mesas[i].listaProductos.concat(this.mesas[i].productosCobrados)]
      this.mesas[i].productosCobrados = [];
      this.servicioMesaProductos.postActualizar(this.mesas[i]);
      this.mesaUnica = new mesaProductos();
      console.log("\nthis.mesas[i] = ", this.mesas[i]);
      this.mesas.splice(i, 1);
      break;
    }
  }
}





}
