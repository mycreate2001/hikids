import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WrittingConfigPage } from './writting-config.page';

const routes: Routes = [
  {
    path: '',
    component: WrittingConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WrittingConfigPageRoutingModule {}
