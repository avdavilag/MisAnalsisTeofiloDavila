import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdenCompletaTurnosPageRoutingModule } from './orden-completa-turnos-routing.module';

import { OrdenCompletaTurnosPage } from './orden-completa-turnos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdenCompletaTurnosPageRoutingModule
  ],
  declarations: [OrdenCompletaTurnosPage]
})
export class OrdenCompletaTurnosPageModule {}
