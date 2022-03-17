import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { bookingUrls } from 'src/api-urls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EzyContracts';
  company;

  MINUTES_UNITL_AUTO_LOGOUT;
  CHECK_INTERVAL = 5 // in ms
  STORE_KEY = 'lastAction';


  public getLastAction() {
    return parseInt(localStorage.getItem(this.STORE_KEY));
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(this.STORE_KEY, lastAction.toString());
  }

  constructor(private router: Router, private http:HttpClient) { 
  
  }


  ngOnInit(): void {
    this.check();
    this.initListener();
    this.initInterval();
    localStorage.setItem(this.STORE_KEY,Date.now().toString());

setTimeout(()=>{
  this.company = JSON.parse(localStorage.getItem('companyData'))
    if(this.company){    
      this.getCompany(this.company.company_code);
    }
},3000)
  
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover',()=> this.reset());
    document.body.addEventListener('mouseout',() => this.reset());
    document.body.addEventListener('keydown',() => this.reset());
    document.body.addEventListener('keyup',() => this.reset());
    document.body.addEventListener('keypress',() => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, this.CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + this.MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    if (isTimeout)  {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  getCompany(val){
    this.http.get(bookingUrls.company + `/${val}`).subscribe((res:any) => {
      if(res.data){
        this.MINUTES_UNITL_AUTO_LOGOUT  = res.data?.logout || 15;
      } 
    })
  }

}
