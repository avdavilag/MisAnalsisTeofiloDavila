import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescargaFacturasPage } from './descarga-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: DescargaFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DescargaFacturasPageRoutingModule {}
