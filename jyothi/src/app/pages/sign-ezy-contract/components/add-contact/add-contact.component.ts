import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { bookingUrls } from 'src/api-urls';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {

  eachContact;
  formData: any = {};
  vendorsData: any = [];
  constructor(public modal: NgbActiveModal, private http: HttpClient, private toaster: ToastrService) { }


  ngOnInit(): void {
    this.getVendors();
    if (this.eachContact) {
console.log(this.eachContact)
      this.formData = this.eachContact;



    }
  }


  onSubmit(form: NgForm) {
    if (form.valid) {
      let method = this.eachContact ? 'put' : 'post';
      let url = this.eachContact ? bookingUrls.contacts + `/${this.eachContact.name}` : bookingUrls.contacts;
      this.http[method](url, this.formData).subscribe((res: any) => {
        if (res.data) {
          this.eachContact ? this.toaster.success('Updated') : this.toaster.success('Saved');
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

  getVendors() {
    const filters = []
    filters.push(["Vendors", `status`, "=", "Active"]);
    this.http.get(bookingUrls.vendors, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
        filters: JSON.stringify(filters),
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.vendorsData = res.data;

        if(this.eachContact){
          let data = this.vendorsData.find((item: any) => {
            console.log(this.eachContact.vendor_id, item.name)
            if (this.eachContact.vendor_id == item.name) {
              return item;
            }
          });
          this.formData.vendor = data.name;
        }
       
      }
    })
  }

}
