import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'tim-chu',
    pathMatch: 'full'
  },
  {
    path: 'tim-chu',
    loadChildren: () => import('./pages/tim-chu/tim-chu.module').then( m => m.TimChuPageModule)
  },
  {
    path: 'doan-tu',
    loadChildren: () => import('./pages/doan-tu/doan-tu.module').then( m => m.DoanTuPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
