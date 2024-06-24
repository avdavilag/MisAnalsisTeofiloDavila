import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreartrackingordPageRoutingModule } from './creartrackingord-routing.module';

import { CreartrackingordPage } from './creartrackingord.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreartrackingordPageRoutingModule
  ],
  declarations: [CreartrackingordPage]
})
export class CreartrackingordPageModule {}
