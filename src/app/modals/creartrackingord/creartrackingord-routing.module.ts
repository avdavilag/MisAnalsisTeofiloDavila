import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreartrackingordPage } from './creartrackingord.page';

const routes: Routes = [
  {
    path: '',
    component: CreartrackingordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreartrackingordPageRoutingModule {}
