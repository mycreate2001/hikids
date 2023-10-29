import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WordDetailPage } from './word-detail.page';

const routes: Routes = [
  {
    path: '',
    component: WordDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WordDetailPageRoutingModule {}
