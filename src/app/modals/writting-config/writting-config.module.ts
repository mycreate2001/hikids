import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WrittingConfigPageRoutingModule } from './writting-config-routing.module';

import { WrittingConfigPage } from './writting-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WrittingConfigPageRoutingModule
  ],
  declarations: [WrittingConfigPage]
})
export class WrittingConfigPageModule {}
