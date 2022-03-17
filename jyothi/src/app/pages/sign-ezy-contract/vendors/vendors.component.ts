import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { bookingUrls } from 'src/api-urls';
import { AddVendorComponent } from '../components/add-vendor/add-vendor.component';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  formData: any = {};
  eachVendor;
  vendorsData = []
  config: any;
  user:any;
  constructor(private modal: NgbModal, private http: HttpClient, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getVendors()
    this.config = {
      itemsPerPage: 20,
      currentPage: 1,
    }
    let user:string = JSON.parse(localStorage.getItem('full_name'));
    this.user = user.toLowerCase()
  }

  addVendor(type, data) {
    const modalRef = this.modal.open(AddVendorComponent, {
      size: 'md',
      centered: true,
    });

    if (type === 'edit') {
      this.formData = { ...data }
      this.eachVendor = data.name
      modalRef.componentInstance.eachVendor = data
    } else {
      this.formData = {}
      this.eachVendor = ''
    }

    modalRef.result.then((result) => {
      if (result) {
        this.getVendors()
      }
    });


  }


  onSubmit(form: NgForm) {
    if (form.valid) {
      let method = this.eachVendor ? 'put' : 'post';
      let url = this.eachVendor ? bookingUrls.vendors + `/${this.eachVendor}` : bookingUrls.vendors;
      this.http[method](url, this.formData).subscribe((res: any) => {
        if (res.data) {
          this.eachVendor ? this.toaster.success('Updated') : this.toaster.success('Saved');
          this.modal.dismissAll();
          this.getVendors()
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
    form.form.markAllAsTouched()
  }

  getVendors() {
    this.http.get(bookingUrls.vendors, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
        order_by: ['`tabVendors`.`' + 'modified' + '` ' + 'desc' + ''],
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.vendorsData = res.data
        if (this.vendorsData?.length) {
          this.config = {
            itemsPerPage: 20,
            currentPage: 1,
            totalItems: this.vendorsData?.length
          };
        }
      }
    })
  }


  changeStatus(element: any) {
    element.status = element.status === 'Active' ? 'In-Active' : 'Active'
    this.http.put(`${bookingUrls.vendors}/${element.name}`, element).subscribe((res: any) => {
      try {
        if (res.data) {
          this.getVendors();
          this.toaster.success('Status Changed')
        }
      } catch {

      }
    });

  }

  pageChanged($event) {
    this.config.currentPage = event;
  }

}
