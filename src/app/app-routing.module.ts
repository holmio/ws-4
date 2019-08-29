import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './store/auth';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './pages/home/home.module#HomePageModule'
  },

  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'registration', loadChildren: './pages/registration/registration.module#RegistrationPageModule' },
  { path: 'search', loadChildren: './pages/search/search.module#SearchPageModule' },
  // PROFILE
  { path: 'profile/detail', loadChildren: './pages/profile/detail/detail.module#DetailPageModule', canActivate: [AuthGuard] },
  { path: 'profile/edit', loadChildren: './pages/profile/edit/edit.module#EditPageModule', canActivate: [AuthGuard] },
  { path: 'profile/messages', loadChildren: './pages/profile/messages/messages.module#MessagesPageModule', canActivate: [AuthGuard] },
  // PRODUCT
  { path: 'product/edit/:id', loadChildren: './pages/product/edit/edit.module#EditPageModule', canActivate: [AuthGuard] },
  { path: 'product/create', loadChildren: './pages/product/create/create.module#CreatePageModule', canActivate: [AuthGuard] },
  { path: 'product/detail/:id', loadChildren: './pages/product/detail/detail.module#DetailPageModule' },
  
  { path: 'chat/:id', loadChildren: './pages/chat/chat.module#ChatPageModule', canActivate: [AuthGuard]},
  { path: 'user-detail', loadChildren: './pages/user-detail/user-detail.module#UserDetailPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
