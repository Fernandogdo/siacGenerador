import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthorizationService } from 'app/services/login/authorization.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  seMuestra: Boolean
  userdata;
  storage:boolean;

  constructor(
    private authorizationService:AuthorizationService,
    private router: Router
  ){

  }

  redirect(flag: boolean): any {
    if (!flag) {
      this.router.navigate(['/', 'login'])
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let staff = localStorage.getItem("is_staff")
    var isTrueSet = (staff === 'true');

    console.log("SEMUESTRAVARADMINTRUE", isTrueSet)


    if (isTrueSet === true) {
      console.log("ADMIN", isTrueSet )
    }

    this.redirect(isTrueSet)

    return isTrueSet
  }

  // redirect(flag:boolean):any{
  //   if (!flag) {
  //     this.router.navigate(['/', 'login'])
  //   } 
  // }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   if (localStorage.getItem('token')) {
  //     console.log('EXISTETOKEN')
  //     this.storage  = true;
  //   } else{
  //     console.log("NOEXISTETOKEN")
  //     this.storage  = false;
  //   }
    
  //   this.redirect(this.storage)

  //   return this.storage
  // }
  
}
