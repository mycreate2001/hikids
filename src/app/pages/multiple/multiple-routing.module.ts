import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultiplePage } from './multiple.page';

const routes: Routes = [
  {
    path: '',
    component: MultiplePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultiplePageRoutingModule {}
