import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimChuPage } from './tim-chu.page';

const routes: Routes = [
  {
    path: '',
    component: TimChuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimChuPageRoutingModule {}
