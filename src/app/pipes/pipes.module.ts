import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';

import { HighlightPipe } from './highlight.pipe';


@NgModule({
  declarations: [FiltroPipe,HighlightPipe],
  exports:[FiltroPipe,HighlightPipe],
  imports: []
})
export class PipesModule { }
