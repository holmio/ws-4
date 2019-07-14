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
  { path: 'profile/edit/:id', loadChildren: './pages/profile/edit/edit.module#EditPageModule' },
  { path: 'profile/chat-list', loadChildren: './pages/profile/chat-list/chat-list.module#ChatListPageModule', canActivate: [AuthGuard] },
  // PRODUCT
  { path: 'product/edit/:id', loadChildren: './pages/product/edit/edit.module#EditPageModule' },
  { path: 'product/detail/:id', loadChildren: './pages/product/detail/detail.module#DetailPageModule' },
  
  { path: 'chat', loadChildren: './pages/chat/chat.module#ChatPageModule', canActivate: [AuthGuard]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
