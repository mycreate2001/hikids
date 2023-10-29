import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WordDetailPageRoutingModule } from './word-detail-routing.module';

import { WordDetailPage } from './word-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WordDetailPageRoutingModule
  ],
  declarations: [WordDetailPage]
})
export class WordDetailPageModule {}
