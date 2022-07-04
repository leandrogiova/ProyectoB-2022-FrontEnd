import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'productos', component: ListaProductosComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'},  // cuando no se le especifica nada entra en home
  {path: '**', component: Error}  // cuando no matchea con nada entra en error 404 - no encontrado
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
