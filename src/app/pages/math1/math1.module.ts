import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Math1PageRoutingModule } from './math1-routing.module';

import { Math1Page } from './math1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Math1PageRoutingModule
  ],
  declarations: [Math1Page]
})
export class Math1PageModule {}
