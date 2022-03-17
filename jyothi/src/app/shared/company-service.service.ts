import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { bookingUrls } from 'src/api-urls';

@Injectable({
  providedIn: 'root'
})
export class CompanyServiceService {

  
  private company: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) { }


  companyData(data) {
    return this.http.get(bookingUrls.company + `/${data}`).subscribe((res:any) => {
      if(res){
        this.company.next(res.data);
      }
    })
  }


  getCompany(){
    return this.company.asObservable()
  }

  






}
