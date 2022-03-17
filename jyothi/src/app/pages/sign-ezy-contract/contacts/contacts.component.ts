import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap } from 'rxjs/operators';
import { bookingUrls } from 'src/api-urls';
import { AddContactComponent } from '../components/add-contact/add-contact.component';
import { MasterDataService } from '../master-data/master-data.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  vendorsData = [];
  formData: any = {};
  designations = [];
  eachContact;
  contacts = [];
  query;
  config: any;
  onFilterChange = new EventEmitter();
  company;
  user;
  search = {
    vendor: '',
  }


  constructor(private masterData: MasterDataService, private modal: NgbModal, private http: HttpClient, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getVendors();
    this.getContacts();
    this.company = JSON.parse(localStorage.getItem('companyData'))
    let user:string = JSON.parse(localStorage.getItem('full_name'));
    this.user = user.toLowerCase()

  }

  addContact(type, data) {
    const modalRef = this.modal.open(AddContactComponent, {
      size: 'lg',
      centered: true
    })
    if (type === 'edit') {
      this.formData = { ...data };
      this.eachContact = data.name;
      modalRef.componentInstance.eachContact = data;
    } else {
      this.formData = {};
      this.eachContact = ''
    }
    modalRef.result.then((result) => {
      if (result) {
        this.getContacts()
      }
    });

  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      let method = this.eachContact ? 'put' : 'post';
      let url = this.eachContact ? bookingUrls.contacts + `/${this.eachContact}` : bookingUrls.contacts;
      this.http[method](url, this.formData).subscribe((res: any) => {
        if (res.data) {
          this.eachContact ? this.toaster.success('Updated') : this.toaster.success('Saved');
          this.modal.dismissAll();
          this.getContacts();
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
        this.vendorsData = res.data
      }
    })
  }

  getDesignations() {
    const filters = []
    filters.push(["Designations", `status`, "=", "Active"]);
    this.http.get(bookingUrls.designations, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
        filters: JSON.stringify(filters),
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.designations = res.data
      }
    })
  }

  getContacts() {
    this.config = {
      itemsPerPage: 20,
      currentPage: 1,
      totalItems: this.contacts?.length
    };
    this.onFilterChange.pipe(debounceTime(300), switchMap((res) => {
      const filters = [];

      if (this.search.vendor) {
        filters.push(["vendor", "=", `${this.search.vendor}`])
      }
      if (this.company?.company_code) {
        filters.push(["company_code", "=", `${this.company?.company_code}`])
      }
      return this.http.get(bookingUrls.getContacts, {
        params: {
          limit_page_length: "None",
          fields: JSON.stringify(['*']),
          filters: JSON.stringify(filters),
          order_by: ['`tabContacts`.`' + 'modified' + '` ' + 'desc' + ''],
        }
      })
    })).subscribe((res: any) => {
      if (res?.message?.success) {
        this.contacts = res.message?.data;
        this.config = {
          itemsPerPage: 20,
          currentPage: 1,
          totalItems: this.contacts?.length
        };
      }
    });
    this.onFilterChange.emit('');
  }




  changeStatus(element: any) {
    element.status = element.status === 'Active' ? 'In-Active' : 'Active'
    this.http.put(`${bookingUrls.contacts}/${element.name}`, element).subscribe((res: any) => {
      try {
        if (res.data) {
          this.getContacts();
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
