import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultiplePageRoutingModule } from './multiple-routing.module';
import { MultiplePage } from './multiple.page';
// import { MultiplePage } from './multiple.page';

// import { MultiplePage } from './multiple.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultiplePageRoutingModule
  ],
  declarations: [MultiplePage]
})
export class MultiplePageModule {}
