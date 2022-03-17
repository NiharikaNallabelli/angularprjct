import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthgurdService } from './shared/authgurd.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  constructor(private Authguardservice: AuthgurdService, private router: Router) {
    console.log(this.router)
   }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean  {
   

    if (state.url !== '/login' && !this.Authguardservice.gettoken()) {
      this.router.navigate(['/login']);
      return false;
    }
    
    if (state.url === '/login' && this.Authguardservice.gettoken()) {
      console.log(state.url)
      this.router.navigate(['/ezy-contracts']);
      return true;
    }
    return true;
    // if (!this.Authguardservice.gettoken()) {
    //   this.router.navigateByUrl("/login");
    // }
    // return this.Authguardservice.gettoken();
  }

}
