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
    console.log("FLAG", !flag)
    if (!flag) {
      console.log("FLAGTESTF", !flag)
      console.log("NO TIENES ACCESO")
      this.router.navigate(['/', 'login'])
      this.authorizationService.cerrarSesionDocente()
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.staff = localStorage.getItem("is_staff")
    console.log("STAFF", this.staff)
    var isTrueSet = (this.staff === 'true');
    
    console.log("CANACTIVATEADMIN", isTrueSet)

    if (isTrueSet === false) {
      
      this.isTrueSet = true
      console.log("EXISTETOKEN", this.isTrueSet)
    } 

    if (!this.token) {
      this.isTrueSet = false
      console.log("NOEXISTETOKEN", this.isTrueSet)
    }
    
    // else{
    //   this.isTrueSet = false
    //   console.log("NOEXISTETOKEN", this.isTrueSet)

    // }

    console.log("SEMUESTRAVARTESTTRUE", this.isTrueSet)
    this.redirect(this.isTrueSet)

    return this.isTrueSet
  }
}
