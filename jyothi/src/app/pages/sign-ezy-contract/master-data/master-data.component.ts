import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { bookingUrls } from 'src/api-urls';

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.scss']
})
export class MasterDataComponent implements OnInit {

  active = '1';
  eachDepartment;
  eachDesignation;
  eachDocument;
  eachContract;
  departmentsData = [];
  designations = [];
  doctypes = [];
  contracts = []
  departmentFormData: any = {};
  designationFormData: any = {};
  doctypeFormData:any = {};
  contractFormData:any = {};
  selectedOption: any = "hotel";
  constructor(private modal: NgbModal, private toaster: ToastrService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getDepartments();
    this.getDesignations();
    this.getDoctypes();
    this.getContracts();
  }

  optionSelection(optionType: any) {
    this.selectedOption = optionType
  }

  addDepartment(departments, type, data) {
    if (type === 'edit') {
      this.departmentFormData = {...data}
      this.eachDepartment = data.name
    } else {
      this.departmentFormData = {}
      this.eachDepartment = ''
    }
    this.modal.open(departments, {
      size: 'md',
      centered: true,
    })
  }

  addRole(role, type, data) {

    if (type === 'edit') {
      this.designationFormData = {...data}
      this.eachDesignation = data.name
    } else {
      this.designationFormData = {}
      this.eachDesignation = ''
    }

    this.modal.open(role, {
      size: 'md',
      centered: true,
    })
  }

  addDocumnet(documnet, type, data) {
    if (type === 'edit') {
      this.doctypeFormData = {...data}
      this.eachDocument = data.name
    } else {
      this.doctypeFormData = {}
      this.eachDocument = ''
    }

    this.modal.open(documnet, {
      size: 'md',
      centered: true,
    })
  }


  addContract(contract, type, data) {
    if (type === 'edit') {
      this.contractFormData = {...data}
      this.eachContract = data.name
    } else {
      this.contractFormData = {}
      this.eachContract = ''
    }

    this.modal.open(contract, {
      size: 'md',
      centered: true,
    })
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      let method = this.eachDepartment ? 'put' : 'post';
      let url = this.eachDepartment ? bookingUrls.departments + `/${this.eachDepartment}` : bookingUrls.departments;
      this.http[method](url, this.departmentFormData).subscribe((res: any) => {
        if (res.data) {
          this.eachDepartment ? this.toaster.success('Updated') : this.toaster.success('Saved');
          this.modal.dismissAll();
          this.getDepartments()
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
    form.form.markAllAsTouched()
  }


  designationSubmit(form: NgForm) {
    if (form.valid) {
      let method = this.eachDesignation ? 'put' : 'post';
      let url = this.eachDesignation ? bookingUrls.designations + `/${this.eachDesignation}` : bookingUrls.designations;
      this.http[method](url, this.designationFormData).subscribe((res: any) => {
        if (res.data) {
          this.eachDesignation ? this.toaster.success('Updated') : this.toaster.success('Saved');
          this.modal.dismissAll();
          this.getDesignations()
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
    form.form.markAllAsTouched()
  }


  doctypeSubmit(form: NgForm){
    if (form.valid) {
      let method = this.eachDocument ? 'put' : 'post';
      let url = this.eachDocument ? bookingUrls.docTypes + `/${this.eachDocument}` : bookingUrls.docTypes;
      this.http[method](url, this.doctypeFormData).subscribe((res: any) => {
        if (res.data) {
          this.eachDocument ? this.toaster.success('Updated') : this.toaster.success('Saved');
          this.modal.dismissAll();
          this.getDoctypes()
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
    form.form.markAllAsTouched()
  }


  contractSubmit(form: NgForm){
    if (form.valid) {
      let method = this.eachContract ? 'put' : 'post';
      let url = this.eachContract ? bookingUrls.contractTypes + `/${this.eachContract}` : bookingUrls.contractTypes;
      this.http[method](url, this.contractFormData).subscribe((res: any) => {
        if (res.data) {
          this.eachContract ? this.toaster.success('Updated') : this.toaster.success('Saved');
          this.modal.dismissAll();
          this.getContracts()
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
    form.form.markAllAsTouched()

  }

  getDepartments() {
    this.http.get(bookingUrls.departments, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.departmentsData = res.data
      }
    })
  }


  getDesignations() {
    this.http.get(bookingUrls.designations, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.designations = res.data
      }
    })
  }


  getDoctypes() {
    this.http.get(bookingUrls.docTypes, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.doctypes = res.data
      }
    })
  }


  getContracts() {
    this.http.get(bookingUrls.contractTypes, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.contracts = res.data
      }
    })
  }


  changeStatus(element: any, type) {
    element.status = element.status === 'Active' ? 'In-Active' : 'Active';
    let url;
    if (type === 'departments') {
      url = bookingUrls.departments
    }
    if (type === 'designations') {
      url = bookingUrls.designations
    }
    if (type === 'docTypes') {
      url = bookingUrls.docTypes
    }

    if (type === 'contracts') {
      url = bookingUrls.contractTypes
    }


    this.http.put(`${url}/${element.name}`, element).subscribe((res: any) => {
      try {
        if (res.data) {
          if (type === 'departments') {
            this.getDepartments()
          }

          if (type === 'designations') {
            this.getDesignations()
          }

          if (type === 'docTypes') {
           this.getDoctypes()
          }
          if (type === 'contracts') {
            this.getContracts()
          }
         
          this.toaster.success('Status Changed')
        }
      } catch {

      }
    });

  }






}
