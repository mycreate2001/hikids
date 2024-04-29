import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WrittingPageRoutingModule } from './writting-routing.module';

import { WrittingPage } from './writting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WrittingPageRoutingModule
  ],
  declarations: [WrittingPage]
})
export class WrittingPageModule {}
