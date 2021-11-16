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
    // let staff = localStorage.getItem("is_staff")
    // this.isTrueSet = (staff === 'true');

    this.token = localStorage.getItem("token")
  }


  redirect(flag: boolean): any {
    console.log("FLAG", !flag)
    if (!flag) {
      console.log("FLAGADMINIF", !flag)
      console.log("NO TIENES ACCESO")
      this.router.navigate(['/', 'login'])
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let staff = localStorage.getItem("is_staff")
    var isTrueSet = (staff === 'true');


    if (this.token) {
      
      this.isTrueSet = true
      console.log("EXISTETOKEN", this.isTrueSet)
      // this.router.navigate(['/dashboard'])
    } else{
      this.isTrueSet = false
      console.log("NOEXISTETOKEN", this.isTrueSet)

    }

    console.log("SEMUESTRAVARADMINTRUE", isTrueSet)
    this.redirect(isTrueSet)

    return isTrueSet
  }
}