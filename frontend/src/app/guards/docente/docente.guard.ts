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




  // public getRol(): void {
  //   let staff = localStorage.getItem('is_staff')
  //   console.log("🚀 ~ file: sidebar.component.ts ~ line 45 ~ SidebarComponent ~ getRol ~ staff", staff)

  //   let iduser = localStorage.getItem("id_user");
  //   this.authorizationService.getOneUser(iduser)
  //     .subscribe(res => {
  //       this.userdata = res;
  //       console.log("🚀 ~ file: sidebar.component.ts ~ line 54 ~ SidebarComponent ~ getRol ~ this.userdata", this.userdata)

  //       if (this.userdata.is_staff === true) {
  //         this.seMuestra = true
  //         console.log(this.seMuestra)
  //       } else {
  //         this.seMuestra = false
  //         console.log('falso', this.seMuestra)
  //       }

  //        this.data = this.seMuestra
  //     }
      
  //     );
  //     console.log("SEMUESTRAVAR", this.data)
  //   }

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

      

    // if (localStorage.getItem('token')) {
    //   console.log('EXISTETOKEN')
    //   this.storage = true;
    // } else {
    //   console.log("NOEXISTETOKEN")
    //   this.storage = false;
    // }

    // this.redirect(this.storage)

    // return this.storage
    }
}
