import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthorizationService } from 'app/services/login/authorization.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestGuard implements CanActivate {


  seMuestra: Boolean
  userdata;
  storage:boolean;
  token;
  isTrueSet;
  staff;

  constructor(
    private authorizationService:AuthorizationService,
    private router: Router
  ){
    this.token = localStorage.getItem("token");
    // this.staff = localStorage.getItem("is_staff");
  }

  redirect(flag: boolean): any {
    if (!flag) {
      this.router.navigate(['/', 'login'])
      this.authorizationService.cerrarSesionDocente()
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.staff = localStorage.getItem("is_staff")
    var isTrueSet = (this.staff === 'true');
    

    if (isTrueSet === false) {
      
      this.isTrueSet = true
    } 

    if (!this.token) {
      this.isTrueSet = false
    }
    
    // else{
    //   this.isTrueSet = false
    //   console.log("NOEXISTETOKEN", this.isTrueSet)

    // }

    this.redirect(this.isTrueSet)

    return this.isTrueSet
  }
}
