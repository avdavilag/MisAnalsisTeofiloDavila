import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResponsiveListadoIngresoDeUsuariosPageRoutingModule } from './responsive-listado-ingreso-de-usuarios-routing.module';

import { ResponsiveListadoIngresoDeUsuariosPage } from './responsive-listado-ingreso-de-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResponsiveListadoIngresoDeUsuariosPageRoutingModule
  ],
  declarations: [ResponsiveListadoIngresoDeUsuariosPage]
})
export class ResponsiveListadoIngresoDeUsuariosPageModule {}
