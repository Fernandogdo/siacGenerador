import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from 'app/services/login/authorization.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/cv-completo', title: 'CV Completo',  icon:'account_box', class: '' },
    { path: '/cv-resumido', title: 'CV Resumido',  icon:'contact_page', class: '' },
    { path: '/cv-guardado', title: 'CV Personalizable',  icon:'manage_accounts', class: '' },
    // { path: '/cv-guardado', title: 'CV Guardado',  icon:'manage_accounts', class: '' },

    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  seMuestra: Boolean
  userdata;
  constructor(
    public authorizationService: AuthorizationService
  ) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.getRol()
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  public getRol():void{
      let staff = localStorage.getItem('is_staff')
      console.log("🚀 ~ file: sidebar.component.ts ~ line 45 ~ SidebarComponent ~ getRol ~ staff", staff)
      
      let iduser =  localStorage.getItem("id_user");
      this.authorizationService.getOneUser(iduser)
        .subscribe(res => {
          this.userdata = res; 
          console.log("🚀 ~ file: sidebar.component.ts ~ line 54 ~ SidebarComponent ~ getRol ~ this.userdata", this.userdata)

          if (this.userdata.is_staff === true) {
            this.seMuestra = true
            console.log(this.seMuestra)
          } else{
            this.seMuestra = false
            console.log('falso',this.seMuestra)
          }

        });
       


      // if (staff = 'true') {
      //   this.seMuestra = true
      //   console.log("🚀 ~ file: sidebar.component.ts ~ line 47 ~ SidebarComponent ~ getRol ~ seMuestra", this.seMuestra)
      // }else{
      //   this.seMuestra = false
      //   console.log("🚀 ~ file: sidebar.component.ts ~ line 52 ~ SidebarComponent ~ getRol ~  this.seMuestra",  this.seMuestra)
      // } 
        
      
        
  }

}
