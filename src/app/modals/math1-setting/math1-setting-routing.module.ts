import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Math1SettingPage } from './math1-setting.page';

const routes: Routes = [
  {
    path: '',
    component: Math1SettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Math1SettingPageRoutingModule {}
