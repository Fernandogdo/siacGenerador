import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthorizationService } from 'app/services/login/authorization.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocenteGuard implements CanActivate {

  storage: boolean;
  userdata;
  seMuestra;
  token;
  isTrueSet;

  data;
  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {
    // this.getRol();
    let staff = localStorage.getItem("is_staff")
    this.isTrueSet = (staff === 'true');

    this.token = localStorage.getItem("token")
    if (this.token) {
      
      this.isTrueSet = true
      console.log("EXISTETOKEN", this.isTrueSet)
      this.router.navigate(['/dashboard'])
    } else{
      this.isTrueSet = false
      console.log("NOEXISTETOKEN", this.isTrueSet)

    }

  }


  redirect(flag: boolean): any {
    console.log("FLAGDOCENTE", !flag)
    // let idDocente = localStorage.getItem("id_user")

    // console.log("IDDOCNTEEXISTE", idDocente)
    if (!flag) {
      console.log("FLAGIFTRUENOENTRA", !flag)
      this.router.navigate(['/', 'login'])
    } 
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    // var isTrueSet = (staff === 'true');
    let token = localStorage.getItem("token")


    console.log("SEMUESTRAVAR", this.isTrueSet)
    console.log("TOKEN", token)

    // console.log("DOCENTEFUERA", this.isTrueSet)

    this.redirect(this.isTrueSet)

    return this.isTrueSet
  }
}