import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SearchPipe } from './pipes/search.pipe';
import { SantizerPipe } from './pipes/santizer.pipe';





@NgModule({
  
  exports: [
    CommonModule,
    PerfectScrollbarModule,
    SantizerPipe,
    SearchPipe,

    
  ],

  imports: [
    CommonModule,
    PerfectScrollbarModule,
  ],
  declarations: [
    SantizerPipe,
    SearchPipe,

    
  ],

})

export class SharedModule { }
