import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoanTuPage } from './doan-tu.page';

const routes: Routes = [
  {
    path: '',
    component: DoanTuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoanTuPageRoutingModule {}
