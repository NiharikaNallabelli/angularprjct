import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-ezy-contract',
  templateUrl: './sign-ezy-contract.component.html',
  styleUrls: ['./sign-ezy-contract.component.scss']
})
export class SignEzyContractComponent implements OnInit {
  user;
  company;




  constructor(private http: HttpClient, private router : Router) {
    let user:string = JSON.parse(localStorage.getItem('full_name'));
    this.company = JSON.parse(localStorage.getItem('companyData'));
    this.user = user.toLowerCase()
  }

  ngOnInit(): void {
  }


  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
    window.location.reload();
  }

 
  




 



}
