import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { bookingUrls } from 'src/api-urls';
import { CompanyServiceService } from 'src/app/shared/company-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formData: any = {}
  constructor(private companyService : CompanyServiceService, private http: HttpClient, private toster: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }

  submit(form: NgForm) {
    form.form.markAllAsTouched()
    if (form.valid) {
      this.http.post(bookingUrls.login, this.formData).subscribe((res: any) => {
        if (res.full_name) {
          localStorage.setItem('full_name', JSON.stringify(res.full_name))


          let filters: any = []
          let user = res.full_name

          let filterField: any = this.emailIsValid(form.value.usr) ? 'email' : 'username';


          if (user.toLowerCase() === 'administrator') {
            this.toster.success('Login Success')
           
            this.router.navigate(['/ezy-contracts/user-management'])
          }


          if (user.toLowerCase() != 'administrator') {
            filters.push(["User", `${filterField}`, "=", `${this.formData.usr}`])
            this.http.get(bookingUrls.users, {
              params: {
                fields: JSON.stringify(["*"]),
                filters: JSON.stringify(filters)
              }
            }).subscribe((res: any) => {
              console.log(res)
              if (res.data[0]) {
                let data = res.data[0]
                let company_code = res.data[0]?.company_code;
               if(company_code){
                this.companyService.companyData(company_code)
               }
                this.http.get(bookingUrls.company + `/${company_code}`).subscribe((res: any) => {
                  if (res.data.status === 'Active') {
                    this.toster.success('Login Success')
                    localStorage.setItem('companyData', JSON.stringify(data))
                    this.router.navigate(['/ezy-contracts/user-management'])
                  } else {
                    this.toster.error('Company Status In-Active')
                  }
                })
              }
            })
          }

        } else {
          this.toster.error(res.message)
        }
      }, (error) => {
        this.toster.error(error.error.message)
      })
    }
  }

  emailIsValid(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

}
