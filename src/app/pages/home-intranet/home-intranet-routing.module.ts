import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeIntranetPage } from './home-intranet.page';
import { CheckActiveIntranet } from 'src/app/seguridad/CheckActiveIntranet';

const routes: Routes = [
  {
    path: '',
    component: HomeIntranetPage,
    children:[
      {
        path: 'lista-ordenes',
       // loadChildren: '../ingreso-pedido/ingreso-pedido.module#IngresoPedidoPageModule'
        loadChildren: () => import('../lista-orden/lista-orden.module').then( m => m.ListaOrdenPageModule),
        canActivate: [CheckActiveIntranet]
      },
      {
        path: 'ingreso-orden',
        loadChildren: () => import('../ingreso-orden/ingreso-orden.module').then( m => m.IngresoOrdenPageModule)
      },

      {
        path: 'envio-bloque',
        loadChildren: () => import('../envio-bloque/envio-bloque.module').then( m => m.EnvioBloquePageModule),
        
      },

      {
        path: 'ingreso-orden-completa',
        loadChildren: () => import('../ingreso-orden-completa/ingreso-orden-completa.module').then( m => m.IngresoOrdenCompletaPageModule)
      },

      {
        path: 'envio-iess',
        loadChildren: () => import('../envio-iess/envio-iess.module').then( m => m.EnvioIessPageModule)
      },

      {
        path: 'descarga-facturas',
        loadChildren: () => import('../descarga-facturas/descarga-facturas.module').then( m => m.DescargaFacturasPageModule)
      },
      
      {
        path: 'busqueda-pacientes',
        loadChildren: () => import('../busqueda-pacientes/busqueda-pacientes.module').then( m => m.BusquedaPacientesPageModule)
      },  
      {
      path: 'responsive-listado-ingreso-de-usuarios',
      loadChildren: () => import('../responsive-listado-ingreso-de-usuarios/responsive-listado-ingreso-de-usuarios.module').then( m => m.ResponsiveListadoIngresoDeUsuariosPageModule)
      },   
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'lista-ordenes',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeIntranetPageRoutingModule {}
