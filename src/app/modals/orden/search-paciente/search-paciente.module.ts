import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPacientePageRoutingModule } from './search-paciente-routing.module';

import { SearchPacientePage } from './search-paciente.page';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPacientePageRoutingModule,
    PipesModule
  ],
  declarations: [SearchPacientePage]
})
export class SearchPacientePageModule {}
