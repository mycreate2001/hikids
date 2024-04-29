import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WrittingPage } from './writting.page';

const routes: Routes = [
  {
    path: '',
    component: WrittingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WrittingPageRoutingModule {}
