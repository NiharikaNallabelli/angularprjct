import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthgurdService {

  constructor() { }

  gettoken() {
    return !!localStorage.getItem("full_name");
  }


}
