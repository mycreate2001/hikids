import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimChuPageRoutingModule } from './tim-chu-routing.module';

import { TimChuPage } from './tim-chu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimChuPageRoutingModule
  ],
  declarations: [TimChuPage]
})
export class TimChuPageModule {}
