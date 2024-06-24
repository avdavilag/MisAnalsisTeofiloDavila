import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescargaFacturasPageRoutingModule } from './descarga-facturas-routing.module';

import { DescargaFacturasPage } from './descarga-facturas.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    DescargaFacturasPageRoutingModule
  ],
  declarations: [DescargaFacturasPage]
})
export class DescargaFacturasPageModule {}
