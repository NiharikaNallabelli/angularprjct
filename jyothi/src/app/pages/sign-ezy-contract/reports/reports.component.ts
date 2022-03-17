import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap } from 'rxjs/operators';
import { bookingUrls } from 'src/api-urls';
import { ExcelService } from 'src/app/shared/xl.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {


  contracts = []
  config: any;
  query;
  departments = [];
  vendorsData = [];
  contractsData = [];
  totalContracts;
  totalAmount;
  total_invoices;
  total_amount;
  active = '1';
  selectedOption: any = "company";
  search: any = {
    vendor: '',
    department: '',
    contract_name: '',
    filterDate: []
  }
  onFilterChange = new EventEmitter()
  constructor(private excelService: ExcelService, private modal: NgbModal, private router: Router, private toaster: ToastrService, private http: HttpClient) { }

  ngOnInit(): void {
    // this.getVendors();

    this.getDepartments();
    this.getDep();
    this.getContracts();
  }

  optionSelection(optionType: any) {
    this.selectedOption = optionType

    if (this.selectedOption === 'notification') {
      this.getDep()
    } else {
      this.getDep()
    }

  }


  getVendors() {
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

  getDepartments() {
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



  getDep() {
    this.config = {
      itemsPerPage: 20,
      currentPage: 1,
      totalItems: this.contracts?.length
    };
    this.onFilterChange.pipe(debounceTime(300), switchMap((res) => {
      const filters = [];
      if (this.search.filterDate?.length) {
        filters.push(["creation", "Between", [`${moment(this.search.filterDate[0]).format('YYYY-MM-DD')}`, `${moment(this.search.filterDate[1]).format('YYYY-MM-DD')}`]])
      }
      if (this.search.vendor) {
        filters.push(["select_vendor", "=", `${this.search.vendor}`])
      }

      if (this.search.department) {
        filters.push(["select_department", "=", `${this.search.department}`])
      }


      if (this.search.contract_name) {
        filters.push(["contract_name", "=", `${this.search.contract_name}`])
      }

      return this.http.get(bookingUrls.getDashboard, {
        params: {
          limit_page_length: "None",
          department: this.selectedOption === 'notification' ? "0" : "1",
          fields: JSON.stringify(['*']),
          filters: JSON.stringify(filters),
          // order_by: ['`tabContracts`.`' + 'modified' + '` ' + 'desc' + ''],

        }
      })
    })).subscribe((res: any) => {
      if (res.message.success) {
        this.contracts = res.message?.data;
        if (this.selectedOption === 'notification') {
          this.contracts.map((item: any) => {
            item.expireStatus = this.expiryDate(item.end_date)
          })
        }

        if (this.selectedOption === 'company') {
          this.totalContracts = this.contracts.map(item => item.total_counts).reduce((prev, next) => prev + next);
          this.totalAmount = this.contracts.map(item => item.total_amount).reduce((prev, next) => prev + next);
        }

        if (this.selectedOption === 'notification') {
          this.total_invoices = this.contracts.map(item => item.total_invoices).reduce((prev, next) => prev + next);
          this.total_amount = this.contracts.map(item => item.total_amount).reduce((prev, next) => prev + next);
        }

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

  clear() {
    this.search.filterDate = []
    this.onFilterChange.emit('');
  }

  exportAsXLSX(): void {
    if (this.selectedOption === 'company'){
      let arr = [...this.contracts]
      let totalObj:any = {}
      totalObj.select_department = "",
      totalObj.total_counts =  this.totalContracts || 0,
      totalObj.total_amount =  this.totalAmount || 0,
      arr.push(totalObj);
      this.excelService.exportAsExcelFile(arr, 'sample');
    }

    if (this.selectedOption === 'notification'){
      let arr = [...this.contracts]
      let totalObj:any = {}
      totalObj.contract_name = "",
      totalObj.total_invoices =  this.total_invoices || 0,
      totalObj.total_amount =  this.total_amount || 0,
      totalObj.expireStatus = "",
      totalObj.end_date = ""
      arr.push(totalObj);
      this.excelService.exportAsExcelFile(arr, 'sample');
    }
    
  }


  expiryDate(date_string) {
    var expiration = moment(date_string).format("YYYY-MM-DD");
    var current_date = moment().format("YYYY-MM-DD");
    var days = moment(expiration).diff(current_date, 'days');
    return days;
  }


  getContracts() {
    this.http.get(bookingUrls.getContracts, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
      }
    }).subscribe((res: any) => {
      if (res?.message) {
        this.contractsData = res.message?.data
      }
    })
  }


}
