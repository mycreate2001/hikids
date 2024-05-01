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
  {
    path: 'setting',
    loadChildren: () => import('./pages/setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'word-detail',
    loadChildren: () => import('./pages/word-detail/word-detail.module').then( m => m.WordDetailPageModule)
  },
  {
    path: 'math1',
    loadChildren: () => import('./pages/math1/math1.module').then( m => m.Math1PageModule)
  },
  {
    path: 'math1-setting',
    loadChildren: () => import('./modals/math1-setting/math1-setting.module').then( m => m.Math1SettingPageModule)
  },
  {
    path: 'writting',
    loadChildren: () => import('./pages/writting/writting.module').then( m => m.WrittingPageModule)
  },  {
    path: 'writting-config',
    loadChildren: () => import('./modals/writting-config/writting-config.module').then( m => m.WrittingConfigPageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/test/test.module').then( m => m.TestPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
