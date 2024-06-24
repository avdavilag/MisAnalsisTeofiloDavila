import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponsiveListadoIngresoDeUsuariosPage } from './responsive-listado-ingreso-de-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: ResponsiveListadoIngresoDeUsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponsiveListadoIngresoDeUsuariosPageRoutingModule {}
