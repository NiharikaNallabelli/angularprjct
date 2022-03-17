import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from 'src/app/authentication.guard';
import { ContactsComponent } from './contacts/contacts.component';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { AddContractComponent } from './contracts/add-contract/add-contract.component';
import { ContractsComponent } from './contracts/contracts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MasterDataComponent } from './master-data/master-data.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';

import { SignEzyContractComponent } from './sign-ezy-contract.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { VendorsComponent } from './vendors/vendors.component';
import { ViewAllComponent } from './view-all/view-all.component';

const routes: Routes = [
  { 
    path: '', 
    component: SignEzyContractComponent,
    canActivate:[AuthenticationGuard],
    children : [
      {
        path : '',
        redirectTo : 'contracts',
        pathMatch : 'full'
      },
      {
        path : 'master-data',
        component : MasterDataComponent
      },
      {
        path : 'contracts',
        component : ContractsComponent
      },
      {
        path : 'vendors',
        component : VendorsComponent
      },
      {
        path : 'contacts',
        component : ContactsComponent
      },
      {
        path : 'contract-details',
        component : ContractDetailsComponent
      },
      {
        path : 'view-all',
        component : ViewAllComponent
      },
      {
        path : 'add-contract',
        component : AddContractComponent
      },
      {
        path : 'settings',
        component : SettingsComponent
      },
      {
        path : 'user-management',
        component : UserManagementComponent
      },
      {
        path : 'reports',
        component : ReportsComponent
      },
      {
        path : 'dashboard',
        component : DashboardComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignEzyContractRoutingModule { }
