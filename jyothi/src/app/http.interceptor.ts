
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor as HTTP
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { bookingUrls } from '../api-urls';
import { LoaderService } from './shared/loader.component';
import { CompanyServiceService } from './shared/company-service.service';
// import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpInterceptor implements HTTP {
  apiCount = 0;
  nonLoadingApis = [];
  company;
  constructor(
    private loader: LoaderService,
    private router: Router,
    private companyService: CompanyServiceService
    // private toastr: ToastrService
  ) {

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.apiCount++;
    const body = request.body;
    let withCredentials = true;
    if (body instanceof FormData) {
      if (body.get('cmd') == 'login') {
        withCredentials = false;
      }
    }
    if (request.url.includes('login') == true) {
      withCredentials = false;
    }
    // console.log(request)
    if (this.nonLoadingApis.indexOf(request.url) == -1) {
      this.loader.showLoader();
    }
    let temp = request.clone({
      withCredentials: withCredentials,
    });
    let user: string = JSON.parse(localStorage.getItem('full_name'));
    user = user?.toLowerCase()
    if (user !== "administrator") {
      if (localStorage.getItem('companyData')) {
        if (request.method === 'GET') {
          // console.log(request.params.get('filters'))
          let company: any = JSON.parse(localStorage.getItem('companyData'));
          let reqFilters = JSON.parse(request.params.get('filters'));
          let filters: any = reqFilters?.length ? [...reqFilters] : [];
          console.log(request.urlWithParams)
          if (request.urlWithParams.includes('api/resource/') || request.urlWithParams.includes('api/method/')) {
            if ( !request.urlWithParams.includes('/api/resource/Departments?') && !request.urlWithParams.includes('/api/resource/Designations?') && !request.urlWithParams.includes('/api/resource/Document Types?') && !request.urlWithParams.includes('/api/resource/Contract Types?') && !request.urlWithParams.includes('/api/resource/Role') && !request.urlWithParams.includes('/api/resource/Version?')) {
              filters.push(["company_code", "=", `${company.company_code}`])
              temp = request.clone({
                setParams: {
                  filters: JSON.stringify(filters)
                },
                withCredentials: withCredentials,
              });
            }
          }

        }

        if (request.method === 'POST') {
          let company: any = JSON.parse(localStorage.getItem('companyData'));
          if (company?.company_code) {
            request.body["company_code"] = company?.company_code
          }
        }
      }
    }
    return next.handle(temp).pipe(map(event => {
      return event;
    }), finalize(() => {
      if (this.nonLoadingApis.indexOf('api/' + request.url) == -1) {
        this.apiCount--;
        if (this.apiCount <= 0) {
          this.loader.hideLoader();
        }
      }
    }), catchError(err => {

      if (err.status === 401 || err.error.exc_type == "CSRFTokenError") {
        //   //  this.toastr.show("Session Expired")
        //   localStorage.clear()
        //   sessionStorage.removeItem("SelItem");
        //   // this.toastr.show("Session Expired")
        //   this.router.navigate(['']);
        // }
        // if (err.status === 500) {
        //   this.toastr.error("Internal Error 500");
        // }
        // if (err.status === 403) {
        //   // this.toastr.error("Forbidden Error 403")
        // }
        // if (err.status === 409) {
        //   this.toastr.error("Already Exists");
        // }
        // if (err.status === 400) {
        //   this.toastr.error("Bad Request");
      }
      return throwError(err);
    }));
  }
}
