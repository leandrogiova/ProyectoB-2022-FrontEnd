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
  lista2: Producto[];

  verLista: boolean;
  verListaProductos: boolean;
  verUnaMesaBool: boolean;



  constructor(private servicioProducto: ProductoService,private mesaProductoService: MesaProductoService ,private fb: FormBuilder ) { 

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
    this.lista2 = [];
    this.mesaUnica = new mesaProductos();

  }

  ngOnInit() {
    this.servicioProducto.getAllProductos().subscribe(productos => {
      this.productos = productos;
    });

    this.mesaProductoService.getMesasAbiertas().subscribe(mesaAbiertas => {
      this.mesas = mesaAbiertas;
    });

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
    this.mesaProductoService.getMesasAbiertas().subscribe(mesaAbiertas => {
      this.mesas = mesaAbiertas;
    });
  }





    /*
     * FUNCION enviarServidorProductoAMesa
     *  Levanta una nueva mesa agregando un unico producto, enviando un objeto MesaProdutos a la base de datos.
  */
    enviarServidorProductoAMesa(): void{
      let numero: number = 0;
      numero = this.numeroDeProducto.value;  
      for(let i: number = 0; i <= this.productos.length; i++){
        if(numero == this.productos[i].numeroProducto){      
          let milista: Producto[] = [];
//          this.productos[i].cobrado = false;
          milista.push(this.productos[i]);
          this.abrirNuevaMesa.fecha = this.fecha1Mesa.value;
          this.abrirNuevaMesa.listaProductos = milista;
//          this.abrirNuevaMesa.productosCobrados = [];
          this.abrirNuevaMesa.precioTotal = this.productos[i].precio;
          break;
        }
        else{
          console.log("ERROR - NO SE ENCONTRO EL PRODUCTO QUE SE QUIREE AGREGAR");
          this.abrirNuevaMesa.fecha = this.fecha1Mesa.value;
          this.abrirNuevaMesa.precioTotal = 0;
        }
      }
      this.abrirNuevaMesa.estado = true;
      this.abrirNuevaMesa.numero_mesa = this.numeroMesa.value;
      this.abrirNuevaMesa.precioTemporal = 0;
      
      console.log("Enviando el objeto:", this.abrirNuevaMesa);
      this.mesas.push(this.abrirNuevaMesa);
      this.mesaProductoService.postAbrirMesa(this.abrirNuevaMesa);

      //limpio los casilleros
      this.numeroMesa = new FormControl('');
      this.fecha1Mesa = new FormControl('');
      this.numeroDeProducto = new FormControl('');
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
          this.mesaProductoService.postActualizar(this.mesas[i]);    
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
agregarMuchosProductos(): void{
  for(var i in this.mesas){
    if(this.numeroMesa.value == this.mesas[i].id){
      for(let e =0; e <= this.productos.length; e++){
        if(this.numeroDeProducto.value == this.productos[e].numeroProducto){
          this.productos[e].cobrado = false;
          this.lista2.push(this.productos[e]);
          console.log("ACTUALIZADO lista2=", this.lista2);
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
  
      for(let i: number =0; i <= this.lista2.length; i++){
  
        if($event.target.value == this.lista2[i].numeroProducto){
          console.log("\n\n1--lista2 = ", this.lista2, "\n\nobjeto A eliminar = ", this.lista2[i], "\n\ni = ", i);
          this.lista2.splice(i, 1);
  
          console.log("\n\n2--lista2 = ", this.lista2);
          break;
        }
      }
  
    }


    






    /*
  */
  enviandoMuchosProductos(): void{
    for(let i in this.mesas){
      if(this.numeroMesa.value == this.mesas[i].id){
        this.mesas[i].listaProductos = this.lista2.concat(this.mesas[i].listaProductos);
        this.mesas[i].precioTotal = 0;
        for(let e in this.mesas[i].listaProductos){
          this.mesas[i].precioTotal = this.mesas[i].precioTotal + this.mesas[i].listaProductos[e].precio;
        }     
        this.mesaProductoService.postActualizar(this.mesas[i]);
        console.log("enviando Muchos productos,", this.mesas[i]);
        this.lista2 = [];
        break;
      } 
    }
  }

}
