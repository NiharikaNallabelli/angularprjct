import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap } from 'rxjs/operators';
import { bookingUrls } from 'src/api-urls';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {

  formData:any={};
  query;
  eachContract;
  activity = false;
  vendorsData = [];
  departments = [];
  activityLogs = [];
  contracts = []
  config:any;
  search = {
    vendor: '',
    department: '',
  }
  onFilterChange = new EventEmitter()
  constructor(private modal: NgbModal, private router : Router, private toaster : ToastrService, private http:HttpClient) { }


  ngOnInit(): void {
    this.getVendors();
    this.getDepartments();    
    this.getContracts();
  }

  addContract() {
    this.router.navigate(['ezy-contracts/add-contract'])
  }

  create(vendors){
    this.modal.open(vendors, {
      size: 'lg',
      centered: true
    })
  }


  view(item){
    this.router.navigate(['ezy-contracts/contract-details'], { queryParams: { id: `${item.name}` } })
  }




getVendors(){
  this.http.get(bookingUrls.vendors, {
    params: {
      fields: JSON.stringify(["*"]),
      limit_page_length: "None",
    }
  }).subscribe((res: any) => {
    if (res.data) {
      this.vendorsData = res.data
    }
  })
}

getDepartments(){
  this.http.get(bookingUrls.departments, {
    params: {
      fields: JSON.stringify(["*"]),
      limit_page_length: "None",
    }
  }).subscribe((res: any) => {
    if (res.data) {
      this.departments = res.data
    }
  })
}



getContracts() {
  this.config = {
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: this.contracts?.length
  };
  this.onFilterChange.pipe(debounceTime(300), switchMap((res) => {
    const filters = [];
    
    if (this.search.vendor) {
      filters.push(["select_vendor", "=", `${this.search.vendor}`])
    }

    if (this.search.department) {
      filters.push(["select_department", "=", `${this.search.department}`])
    }

    return this.http.get(bookingUrls.getContracts, {
      params: {
        limit_page_length: "None",
        fields: JSON.stringify(['*']),
        filters: JSON.stringify(filters),
        order_by: ['`tabContracts`.`' + 'modified' + '` ' + 'desc' + ''],

      }
    })
  })).subscribe((res: any) => {
    if (res.message?.success) {
      this.contracts = res.message?.data;
      this.config = {
        itemsPerPage: 20,
        currentPage: 1,
        totalItems: this.contracts?.length
      };
    }
  });
  this.onFilterChange.emit('');
}



pageChanged(event) {
  this.config.currentPage = event;
}

activityLog(item) {
  this.http.get(`${bookingUrls.version}`, {
    params: {
      filters: JSON.stringify([['docname', '=', `${item.name}`], ['ref_doctype' ,'=', 'Contracts']]),
      limit_page_length: "None",
      fields: JSON.stringify(['*'])
    }
  }).subscribe((res: any) => {
    if (res.data) {
      let items = res.data.map((each:any)=>{
        if(each.data){
          each.data = JSON.parse(each.data)
        }
        return each
      })
      this.activityLogs = items;
      console.log(this.activityLogs[0].data.created_by)

    }
  })

  this.activity = !this.activity
}

closeLog() {
  this.activity = !this.activity
}

// activityLog(item, activityLogContent){
//   this.modal.open(activityLogContent, {
//     size : 'lg',
//     centered : true
//   })
// }



}
