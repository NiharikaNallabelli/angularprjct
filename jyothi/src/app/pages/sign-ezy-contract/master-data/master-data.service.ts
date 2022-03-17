import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { bookingUrls } from 'src/api-urls';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  public departments = new BehaviorSubject(null)
  constructor(private http:HttpClient) { 
    
  }



  // getDepartments() {
  //   this.http.get(bookingUrls.departments, {
  //     params: {
  //       fields: JSON.stringify(["*"]),
  //       limit_page_length: "None",
  //     }
  //   }).subscribe((res: any) => {
  //     if (res.data) {
  //       this.departments.next(res.data);
  //     }
  //   })
  // }







}
