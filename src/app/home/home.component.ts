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
  fecha1Mesa: FormControl;
  fecha2Mesa: FormControl;


  verOcultar: string;
  productos: Producto[];
  mesas: mesaProductos[];
  mesasResumenes: mesaProductos[];
  mesaUnica: mesaProductos;

  abrirNuevaMesa: mesaProductos;
  productosAgregar: number[];
  listaProductos2: Producto[];

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
    
    this.numeroDeProducto = new FormControl('');
    this.abrirNuevaMesa = new mesaProductos();
    this.fecha1Mesa = new FormControl('');
    this.fecha2Mesa = new FormControl('');

    this.verLista = false;
    this.verOcultar = "Ver";
    this.verListaProductos = false;
    this.verUnaMesaBool = false;

    this.productosAgregar = [];
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
  console.log("verLIsta= ", this.verLista);
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
    this.mesaUnica.listaProductos = this.listaProductos2;
    this.mesaUnica.estado = true;
    this.mesaUnica.fecha = this.fecha1Mesa.value;
    this.mesaUnica.precioTotal = 0;
    this.mesaUnica.precioTemporal = 0;
    this.mesaUnica.formaDePago = "Efectivo";
    this.mesaUnica.detalle = "";
    this.mesaUnica.productosCobrados = [];

  
  this.mesas.push(this.mesaUnica);
  this.servicioMesaProductos.postAbrirMesa(this.mesaUnica);

  this.numeroMesa = new FormControl;
  this.fecha1Mesa = new FormControl('');
  this.listaProductos2 = [];
  this.mesaUnica = new mesaProductos();
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
*/
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







    /*

    VER EL PARAMETRO QUE TOMA LA FUNCION
  */
    eliminarProductoDeLaLista2($event: { target: { value: number; }; }){
      console.log("El producto a eliminar es: ", $event.target.value);
  
      for(let i: number =0; i <= this.listaProductos2.length; i++){
  
        if($event.target.value == this.listaProductos2[i].numeroProducto){
          console.log("\n\n1--lista2 = ", this.listaProductos2, "\n\nobjeto A eliminar = ", this.listaProductos2[i], "\n\ni = ", i);
          this.listaProductos2.splice(i, 1);
  
          console.log("\n\n2--lista2 = ", this.listaProductos2);
          break;
        }
      }
  
    }


    






    /*
  */
  enviandoMuchosProductos(): void{
    for(let i in this.mesas){
      if(this.numeroMesa.value == this.mesas[i].id){
        this.mesas[i].listaProductos = this.listaProductos2.concat(this.mesas[i].listaProductos);
        this.mesas[i].precioTotal = 0;
        for(let e in this.mesas[i].listaProductos){
          this.mesas[i].precioTotal = this.mesas[i].precioTotal + this.mesas[i].listaProductos[e].precio;
        }     
        this.servicioMesaProductos.postActualizar(this.mesas[i]);
        console.log("enviando Muchos productos,", this.mesas[i]);
        this.listaProductos2 = [];
        break;
      } 
    }
  }

}
