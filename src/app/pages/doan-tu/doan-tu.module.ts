import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoanTuPageRoutingModule } from './doan-tu-routing.module';

import { DoanTuPage } from './doan-tu.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoanTuPageRoutingModule
  ],
  declarations: [DoanTuPage]
})
export class DoanTuPageModule {}
