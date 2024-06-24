import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimelineOrdenPageRoutingModule } from './timeline-orden-routing.module';

import { TimelineOrdenPage } from './timeline-orden.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimelineOrdenPageRoutingModule
  ],
  declarations: [TimelineOrdenPage]
})
export class TimelineOrdenPageModule {}
