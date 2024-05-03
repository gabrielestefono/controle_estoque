import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { AuthMakeService } from './guards/auth-make.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthMakeService]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then((m)=>m.DashboardModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'produtos',
    loadChildren: () => import('./modules/products/products.module').then((m)=>m.ProductsModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'categories',
    loadChildren: () => import('./modules/categories/categories.module').then((m)=>m.CategoriesModule),
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
