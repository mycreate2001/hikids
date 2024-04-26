import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Math1Page } from './math1.page';

const routes: Routes = [
  {
    path: '',
    component: Math1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Math1PageRoutingModule {}
