import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { bookingUrls } from 'src/api-urls';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddVendorComponent } from '../../components/add-vendor/add-vendor.component';
import { AddContactComponent } from '../../components/add-contact/add-contact.component';
@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.component.html',
  styleUrls: ['./add-contract.component.scss']
})
export class AddContractComponent implements OnInit {

  contractsData = [];
  departmentsData = [];
  contactsData = [];
  vendorsData = [];
  tagData: any = [];
  usersData: any = [];
  formData: any = {};
  file;
  today = moment(new Date()).format('YYYY-MM-DD');
  checkVendor = '';
  seletedVendor: any = {};
  selectedContractor: any = {};
  validVendor = false;
  constructor(private modal: NgbModal, private http: HttpClient, private toaster: ToastrService, private router: Router) { }

  ngOnInit(): void {
    // this.getContacts();
    this.getVendors();
    this.getContracts();
    this.getDepartments();
    this.getUsers();

  }

  addContract(name) {
    this.addContractType(name)
    return name;


  }

  addDepartment(name) {
    this.addDepartmentType(name)
    return name;

  }

  addTags(name) {
    return { name: name, tag: true };
  }



  async onSubmit(form: NgForm) {
    console.log(this.formData)
    if (form.valid) {
      // if (!this.seletedVendor?.vendor_email) {
      //   let vendor: any = {};
      //   vendor.vendor_name = this.formData.select_vendor
      //   vendor.address = this.formData.vendor_email_id
      //   vendor.vendor_contact_number = this.formData.vendor_contact_number
      //   vendor.vendor_email = this.formData.address
      //   await this.http.post(bookingUrls.vendors, vendor).subscribe((res: any) => {
      //     if (res.data) {
      //       this.toaster.success('vendor Created')
      //     }
      //   })
      // }
      if (!this.selectedContractor?.email) {
        let contacts: any = {};
        contacts.vendor = this.formData.select_vendor;
        contacts.contact_name = this.formData.select_contact
        contacts.phone_number = this.formData.contact_number
        contacts.email = this.formData.contact_email_id

        await this.http.post(bookingUrls.contacts, contacts).subscribe((res: any) => {
          if (res.data) {
            this.toaster.success('Contact Created')
          }
        })
      }

      this.formData.select_notification_group = this.formData?.select_notification_group?.toString();
      this.formData.tags = this.formData?.tags?.toString();
      await this.http.post(bookingUrls.contracts, this.formData).subscribe((res: any) => {
        if (res) {
          console.log(res.data)
          this.toaster.success('Saved')
          this.router.navigate(['/ezy-contracts/contracts'])
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
    form.form.markAllAsTouched()
  }


  async vendorSave() {
    if (!this.seletedVendor?.vendor_email) {
      let vendor: any = {};
      vendor.vendor_name = this.formData.select_vendor
      vendor.address = this.formData.vendor_email_id
      vendor.vendor_contact_number = this.formData.vendor_contact_number
      vendor.vendor_email = this.formData.address
      await this.http.post(bookingUrls.vendors, vendor).subscribe((res: any) => {
        if (res.data) {
          this.validVendor = true;
          document.getElementById('next').style.display = 'none';
          this.toaster.success('vendor Created')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
  }

  addContractType(data) {
    console.log(data)
    if (data) {
      this.http.post(bookingUrls.contractTypes, {
        contract_name: data
      }).subscribe((res: any) => {
        if (res.data) {
          this.toaster.success('Saved');
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
  }


  addDepartmentType(data) {
    if (data) {
      this.http.post(bookingUrls.departments, {
        department_name: data
      }).subscribe((res: any) => {
        if (res.data) {
          this.toaster.success('Saved');
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
  }


  getContacts(e) {
    const filters = [];

    filters.push(["Contacts", `status`, "=", "Active"]);
    filters.push(["Contacts", `vendor`, "=", `${e}`]);
    this.http.get(bookingUrls.contacts, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
        filters: JSON.stringify(filters),
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.contactsData = res.data
      }
    })
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


  getContracts() {
    const filters = []
    filters.push(["Contract Types", `status`, "=", "Active"]);

    this.http.get(bookingUrls.contractTypes, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
        filters: JSON.stringify(filters),
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.contractsData = res.data
      }
    })
  }

  getDepartments() {
    const filters = []
    filters.push(["Departments", `status`, "=", "Active"]);
    this.http.get(bookingUrls.departments, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
        filters: JSON.stringify(filters),
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.departmentsData = res.data
      }
    })
  }

  getUsers() {
    const filters = []
    this.http.get(bookingUrls.users, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
        filters: JSON.stringify(filters),
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.usersData = res.data
      }
    })
  }



  contactChange(e) {
    this.formData.contact_email_id = '',
    this.formData.contact_number = '',
    this.formData.designation = ''
    if (e && this.checkVendor == '') {
      this.http.get(bookingUrls.contacts + `/${e}`).subscribe((res: any) => {
        if (res.data) {
          let data = res.data;
          this.selectedContractor = res.data;
          this.formData.contact_email_id = data.email
          this.formData.contact_number = data.phone_number
          this.formData.designation = data.designation
          this.checkVendor = ''
        }
      })
    }
  }

  vendorChange(e) {
    this.formData.vendor_email_id = ''
    this.formData.vendor_contact_number = ''
    this.formData.address = ''
    if (e && this.checkVendor == '') {
      console.log("if")

      this.http.get(bookingUrls.vendors + `/${e}`).subscribe((res: any) => {
        if (res.data) {
          this.getContacts(e);
          let data = res.data;
          this.validVendor = true
          this.seletedVendor = res.data;
          this.formData.vendor_email_id = data.vendor_email
          this.formData.vendor_contact_number = data.vendor_contact_number
          this.formData.address = data.address
          this.checkVendor = ''
        }
      })
    } else {
      this.checkVendor = ''
    }
  }


  addTag(tag: string) {
    console.log(tag)
    this.checkVendor = tag;
    return tag;
  }

  private async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('is_private', '0');
    formData.append('folder', 'Home');
    formData.append('doctype', 'Contracts');
    formData.append('fieldname', 'document');
    return this.http.post(bookingUrls.uploadFile, formData).toPromise().then((res: any) => res?.message?.file_url);
  }

  async fileUpload(e) {
    let file = e.target.files[0];
    let files = [{ "attachment_type": "Agreements", "agreement": await this.uploadFile(file) }]
    this.formData.agreement = files;
    this.file = files
    console.log(this.file)
  }



  addVendor() {
    const modalRef = this.modal.open(AddVendorComponent, {
      size: 'md',
      centered: true,
    });

    modalRef.result.then((result) => {
      if (result) {
        this.formData.select_vendor = result.vendor_name;
        this.formData.vendor_email_id = result.vendor_email
        this.formData.vendor_contact_number = result.vendor_contact_number
        this.formData.address = result.address
      }
    });


  }

  addContact() {
    const modalRef = this.modal.open(AddContactComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.result.then((result) => {
      if (result) {
        this.formData.select_contact = result.contact_name;
        this.formData.contact_email_id = result.email
        this.formData.contact_number = result.phone_number
        this.formData.designation = result.designation
      }
    });
  }





}
