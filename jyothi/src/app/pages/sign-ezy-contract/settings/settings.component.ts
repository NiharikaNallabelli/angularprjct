import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { bookingUrls } from 'src/api-urls';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  active = '1';
  selectedOption: any = "company";
  formData: any = {};
  notificationData:any={};
  usersData = [];
  companyFormData;
  states = [];
  companies = [];
  zip_code_valid = false;
  eachCompany;
  company;
  userType;
  constructor(private http: HttpClient, private modal: NgbModal, private toaster: ToastrService) {
    this.company = JSON.parse(localStorage.getItem("companyData"));
    let user:string = JSON.parse(localStorage.getItem("full_name"));
    this.userType = user.toLowerCase();
   }

  ngOnInit(): void {
    this.getUsers();
    this.getCompanies();
    if(this.company?.company_code){
      this.getNotification()
    }
   
    
  }

  optionSelection(optionType: any) {
    this.selectedOption = optionType
    
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


  getNotification(){
    this.http.get(bookingUrls.company +  `/${this.company?.company_code}`).subscribe((res:any) => {
      if(res.data){
        this.notificationData = res.data;
      }
    })
  }



  addCompany(company, type, data) {

    if (type === 'edit') {
      this.companyFormData = {...data}
      this.eachCompany = data.name
    } else {
      this.companyFormData = {}
      this.eachCompany = ''
    }

    this.modal.open(company, {
      size: 'lg',
      centered: true,
    })
  }


  companySubmit(form: NgForm) {
    form.form.markAllAsTouched()
    if (form.valid) {
      let method = this.eachCompany ? 'put' : 'post';
      let url = this.eachCompany ? bookingUrls.company + `/${this.eachCompany}` : bookingUrls.company;
      this.http[method](url, this.companyFormData).subscribe((res: any) => {
        if (res.data) {
          this.eachCompany ? this.toaster.success('Updated') : this.toaster.success('Saved');
          this.modal.dismissAll();
          this.getCompanies()
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
   
  }

  getCompanies() {
    let filters = []
    filters.push(["company_code", "=", `${this.company?.company_code}`])
    this.http.get(bookingUrls.company, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
        order_by: ['`tabCompany`.`' + 'modified' + '` ' + 'desc' + ''],

      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.companies = res.data
      }
    })
  }


  changeStatus(element: any, type) {
    element.status = element.status === 'Active' ? 'In-Active' : 'Active';
    let url;

    if (type === 'companies') {
      url = bookingUrls.company
    }


    this.http.put(`${url}/${element.name}`, element).subscribe((res: any) => {
      try {
        if (res.data) {
          if (type === 'companies') {
            this.getCompanies()
          }
          this.toaster.success('Status Changed')
        }
      } catch {

      }
    });

  }

  close(){
    this.companyFormData = {}
  }

  getPincodeData(e, check = false) {
    let pincode = e
    if (pincode.length == 6 || check) {
      if (!check) {
        this.companyFormData.company_city = "";
        this.companyFormData.company_state = "";
      }
      let url = "https://api.postalpincode.in/pincode/"
      fetch(url + `${pincode}`)
        .then(response => response.json()) // or text() or blob() etc.
        .then(data => {
          if (data[0]?.Status == "Success") {
            this.zip_code_valid = true;
            this.states = data[0].PostOffice;
            this.companyFormData.company_state = data[0].PostOffice[0].State;
            this.states.filter((res: any) => {
              if (res.Name == this.companyFormData.company_city) {
                console.log("========city")
              }
            })
          } else {
            this.states = []
            this.zip_code_valid = false;
          }
        })
    } else {
    }
  }

  notificationSubmit(form:NgForm){
    form.form.markAllAsTouched()
    if (form.valid) {
      this.http.put(bookingUrls.company + `/${this.company?.company_code}`, this.notificationData).subscribe((res:any) => {
        if(res.data){
          this.getNotification()
         this.toaster.success('Updated')
        }
      })
    }
  }


}
