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

  data;
  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {
    // this.getRol();
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

    console.log("SEMUESTRAVAR", isTrueSet)


    if (isTrueSet === false) {
      console.log("DCENTE")
    }

    this.redirect(!isTrueSet)

    return !isTrueSet
  }
}