import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { bookingUrls } from 'src/api-urls';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {

  eachVendor;
  formData: any = {};

  constructor(public modal: NgbActiveModal, private http: HttpClient, private toaster: ToastrService) { }

  ngOnInit(): void {
    if (this.eachVendor) {
      this.formData = this.eachVendor
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      let method = this.eachVendor ? 'put' : 'post';
      let url = this.eachVendor ? bookingUrls.vendors + `/${this.eachVendor.name}` : bookingUrls.vendors;
      this.http[method](url, this.formData).subscribe((res: any) => {
        if (res.data) {
          this.eachVendor ? this.toaster.success('Updated') : this.toaster.success('Saved');
          this.modal.close(res.data);
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
    form.form.markAllAsTouched()
  }




}
