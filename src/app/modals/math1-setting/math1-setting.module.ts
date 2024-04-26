import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Math1SettingPageRoutingModule } from './math1-setting-routing.module';

import { Math1SettingPage } from './math1-setting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Math1SettingPageRoutingModule
  ],
  declarations: [Math1SettingPage]
})
export class Math1SettingPageModule {}
