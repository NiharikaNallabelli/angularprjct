import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './authentication.guard';
import { LoginComponent } from './authentication/login/login.component';

const routes: Routes = [
  {
    path : '',
    pathMatch : 'full',
    redirectTo : 'login'
   
  },
  {
    path : 'login',
    component : LoginComponent,
    canActivate:[AuthenticationGuard],
  },
  { path: 'ezy-contracts', loadChildren: () => import('./pages/sign-ezy-contract/sign-ezy-contract.module').then(m => m.SignEzyContractModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
