import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignEzyContractRoutingModule } from './sign-ezy-contract-routing.module';
import { SignEzyContractComponent } from './sign-ezy-contract.component';
import { MasterDataComponent } from './master-data/master-data.component';
import { NgbActiveModal, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ContractsComponent } from './contracts/contracts.component';
import { VendorsComponent } from './vendors/vendors.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContractDetailsComponent } from './contract-details/contract-details.component';
import { DragulaModule } from 'ng2-dragula';
import { ViewAllComponent } from './view-all/view-all.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { AddContractComponent } from './contracts/add-contract/add-contract.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MasterDataService } from './master-data/master-data.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from './settings/settings.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ActivitylogComponent } from './activitylog/activitylog.component';
import { TrimPipeModule } from 'src/app/shared/pipes/trim.pipe';
import { UnderscoreToSpaceModule } from 'src/app/shared/pipes/underscore-to-space.pipe';
import { ReportsComponent } from './reports/reports.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AddVendorComponent } from './components/add-vendor/add-vendor.component';
import { AddContactComponent } from './components/add-contact/add-contact.component';
import { ExcelService } from 'src/app/shared/xl.service';


@NgModule({
  declarations: [SignEzyContractComponent, MasterDataComponent, ContractsComponent, VendorsComponent, ContactsComponent, ContractDetailsComponent, ViewAllComponent, AddContractComponent, SettingsComponent, UserManagementComponent, ActivitylogComponent, ReportsComponent, DashboardComponent, AddVendorComponent, AddContactComponent],
  imports: [
    CommonModule,
    SignEzyContractRoutingModule,
    NgbNavModule,
    NgbTooltipModule,
    NgSelectModule,
    SharedModule,
    FormsModule,
    NgxChartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgbDropdownModule,
    NgxPaginationModule,
    TrimPipeModule,
    UnderscoreToSpaceModule,
    DragulaModule.forRoot()
  ],
  providers : [MasterDataService, NgbActiveModal, ExcelService]
})
export class SignEzyContractModule { }
