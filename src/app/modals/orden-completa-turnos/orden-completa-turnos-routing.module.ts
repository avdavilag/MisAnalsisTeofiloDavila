import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenCompletaTurnosPage } from './orden-completa-turnos.page';

const routes: Routes = [
  {
    path: '',
    component: OrdenCompletaTurnosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenCompletaTurnosPageRoutingModule {}
