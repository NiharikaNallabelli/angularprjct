import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap } from 'rxjs/operators';
import { bookingUrls } from 'src/api-urls';
import { MasterDataService } from '../master-data/master-data.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {


  vendorsData = [];
  formData: any = {};
  departments = [];
  eachUser:any ={};
  users = [];
  companies = [];
  query;
  config: any;
  selectedUser;
  new_password;
  rolesData = [];
  onFilterChange = new EventEmitter();
  search = {
    vendor: '',
  }

   constructor(private masterData: MasterDataService, private modal: NgbModal, private http: HttpClient, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getVendors();
    this.getDepartments();
    this.getUsers();
    this.getCompanies();
    this.getRoles();
   
  }

  addUser(user, type, data) {
    if (type === 'edit') {     
      this.http.get(bookingUrls.users + `/${data.name}`).subscribe((res:any) => {
        if(res.data){
          this.eachUser = res.data;
          this.formData = res.data;
          this.formData.roles = this.formData.roles.filter((each: any) => each?.role.includes('ezy-'));
          this.modal.open(user, {
            size: 'lg',
            centered: true
          })
        }
      })
    } else {
      this.modal.open(user, {
        size: 'lg',
        centered: true
      })
      this.formData = {};      
      this.eachUser = ''
    }
    
  }

  onSubmit(form: NgForm) {
    form.form.markAllAsTouched()
    
    if (form.valid) {

      let defaultRoles = [{role :'Maintenance Manager'},{role:'System Manager'}] ;     
   
      this.formData.roles = [...defaultRoles,...this.formData.roles]     
    
    console.log(this.formData.roles);   

      let method = this.eachUser ? 'put' : 'post';
      let url = this.eachUser ? bookingUrls.users + `/${this.eachUser.name}` : bookingUrls.users;
      this.formData.roles = this.formData.roles;
      this.formData.full_name =  this.formData.first_name +  this.formData.last_name;
      this.formData.username =  this.formData.email;
      this.modal.dismissAll();
      this.http[method](url, this.formData).subscribe((res: any) => {
        if (res.data) {
          if (form.value.new_password) {
            this.http.put(`${bookingUrls.users}/${form.value.email}`, { new_password: form.value.new_password }).subscribe((res: any) => {
              if (res.data) {
                // setTimeout(() => {
                //   this.http.post(`${bookingUrls.addUserRoles}`, roleObj).subscribe((res: any) => {
                  
                //   })
                // }, 1000)
              }
            })
          }

          this.eachUser ? this.toaster.success('Updated') : this.toaster.success('Saved');
          // this.modal.dismissAll();
          this.getUsers();
        } else {
          this.toaster.error('something went wrong')
        }
      }, (error) => {
        this.toaster.error(error.error._server_messages)
      })
    }
  
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
        this.departments = res.data
      }
    })
  }

  getRoles() {
    this.http.get(bookingUrls.roles, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.rolesData = res.data.filter((each: any) => each?.name.includes('ezy'));
        this.rolesData =  this.rolesData.map((str) => ({ role: str.role_name }));
      }
    })
  }

  getUsers() {
    this.config = {
      itemsPerPage: 20,
      currentPage: 1,
      totalItems: this.users?.length
    };



    this.onFilterChange.pipe(debounceTime(300), switchMap((res) => {
      const filters = [];

      if (this.search.vendor) {
        filters.push(["User", "department", "=", `${this.search.vendor}`])
      }
      return this.http.get(bookingUrls.users, {
        params: {
          limit_page_length: "None",
          fields: JSON.stringify(['*']),
          filters: JSON.stringify(filters),
          order_by: ['`tabUser`.`' + 'modified' + '` ' + 'desc' + ''],


        }
      })
    })).subscribe((res: any) => {
      if (res.data) {
        // this.users = res.data;
        this.users = res.data.filter((each: any) => each.username !== 'guest' && each.username !== "administrator");

        this.config = {
          itemsPerPage: 20,
          currentPage: 1,
          totalItems: this.users?.length
        };
      }
    });
    this.onFilterChange.emit('');
  }




  changeStatus(element: any) {
    element.enabled = element.enabled === 1 ? 0 : 1
    this.http.put(`${bookingUrls.users}/${element.name}`, element).subscribe((res: any) => {
      try {
        if (res.data) {
          this.getUsers();
          this.toaster.success('Status Changed')
        }
      } catch {

      }
    });

  }

  pageChanged($event) {
    this.config.currentPage = event;
  }

  getCompanies() {
    const filters = []
    filters.push([ `status`, "=", "Active"]);
    this.http.get(bookingUrls.company, {
      params: {
        fields: JSON.stringify(["*"]),
        limit_page_length: "None",
        filters : JSON.stringify(filters)
      }
    }).subscribe((res: any) => {
      if (res.data) {
        this.companies = res.data
      }
    })
  }


  changePassword(content, user) {
    this.selectedUser = user;
    this.modal.open(content, {
      centered: true
    });
  }

  changePasswordSave() {
    if (this.new_password) {
      this.http.put(`${bookingUrls.users}/${this.selectedUser?.email}`, { new_password: this.new_password }).subscribe((res: any) => {
        if (res.data) {
          this.toaster.success("Password Changed");
          this.modal.dismissAll();
        } else {
          this.toaster.error("Failed")
        }
      })
    }
  }


}
