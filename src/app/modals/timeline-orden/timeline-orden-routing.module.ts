import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimelineOrdenPage } from './timeline-orden.page';

const routes: Routes = [
  {
    path: '',
    component: TimelineOrdenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimelineOrdenPageRoutingModule {}
