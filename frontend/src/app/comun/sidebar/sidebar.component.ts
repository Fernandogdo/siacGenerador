import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvService } from '../../services/configuracioncv.service';
import { AuthorizationService } from '../../services/login/authorization.service';
import { PdfService } from '../../services/creador-pdf/crea-pdf.service';
import { CreaJsonService } from '../../services/creador-json/crea-json.service';
import { CreaCsvService } from '../../services/creador-csv/crea-csv.service';
import { CreaDocxService } from '../../services/creador-docx/crea-docx.service';
import { CreaTxtService } from '../../services/creador-txt/crea-txt.service';

import { ActivatedRoute, Router } from '@angular/router';


declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  acceso: string;
}
export const ROUTES: RouteInfo[] = [
  // { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', acceso: 'docente' },
  { path: '/administrador', title: 'Administrador', icon: 'person', class: '', acceso: 'admin' },
  { path: '/cv-completo', title: 'Configuración CV Completo', icon: 'account_box', class: '', acceso: 'admin' },
  { path: '/cv-resumido', title: 'Configuración CV Resumido', icon: 'contact_page', class: '', acceso: 'admin' },
  { path: '/cv-guardado', title: 'CVs Personalizados', icon: 'manage_accounts', class: '', acceso: 'docente' },
  { path: '/crea-formatos', title: 'Descargar Formatos', icon: 'manage_accounts', class: '', acceso: 'docente' },
  { path: '/cv-personalizado', title: 'Cear cv Personalizado', icon: 'person', class: '', acceso: 'docente' },
  { path: '/edita-personalizado', title: 'Editar cv Personalizado', icon: 'person', class: '', acceso: 'docente' },
  { path: '/descarga-informacion', title: 'Descarga Información', icon: 'notifications', class: '', acceso: 'docente' },
  { path: '/ingresar-servicio', title: 'Administración de Servicios', icon: 'manage_accounts', class: '', acceso: 'admin' },
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  arreglo = [];
  blob: any;
  idUser;
  nombreCv;
  valor: boolean;

  menuItems: any[];
  seMuestra: Boolean
  userdata;
  staff;
  // id_docente = 10;

  constructor(
    public authorizationService: AuthorizationService,
    public configuracioncvService: ConfiguracioncvService,
    private activatedRoute: ActivatedRoute,
    public pdfService: PdfService,
    public creaJsonService: CreaJsonService,
    public creaDocxService: CreaDocxService,
    public creacvService: CreaCsvService,
    public creatxtService: CreaTxtService,
  ) {
    this.valor = true;

    // setTimeout(()=>{                           // <<<---using ()=> syntax
    //   this.valor = true;
    // }, 1000);

    // setIntrvl(){
    setInterval(() => this.idUsuario(), 2000);
    // }

    // setTimeout(this.mensaje,1000);
    // this.staff =  this.authorizationService.rolUsuario
  }

  ngOnInit() {
    // this.idUser = localStorage.getItem("id_user");
    // console.log("IDUSER", this.idUser)
    this.nombreCv = localStorage.getItem("nombre_cv");

    // this.staff = localStorage.getItem('is_staff')

    // console.log("STAFFDESDESIDEBAR", this.authorizationService.rolUsuario)

    // console.log('IDUDOCENTEIDDOCENTE-------------_>>>>>>>>>>>>>>>>>>>>>>>>', this.idUser)
    this.authorizationService.obtenerIdDocente()
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    // console.log("MENUITEMS", this.menuItems)
    this.getRol()
    // this.getConfiguracionPersonalizada()
    this.isMobileMenu()
    this.isPcMenu()

  }

  idUsuario() {
    this.idUser = localStorage.getItem("id_user");
    // console.log("ISUSUARIO", this.idUser)
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      // console.log("FALSEISMOBILEMENU")
      return false;
    }
    // console.log("TRUEISMOBILEMENU")
    return true;
  };


  isPcMenu() {
    if ($(window).width() > 300) {
      // console.log("PANTALALPC")
      return true;
    }
  }

  public getRol(): void {
    let staff = localStorage.getItem('is_staff')
    // console.log("🚀 ~ file: sidebar.component.ts ~ line 45 ~ SidebarComponent ~ getRol ~ staff", staff)
    var isTrueSet = (staff === 'true');
    // console.log("🚀 ~ file: sidebar.component.ts ~ line 129 ~ SidebarComponent ~ getRol ~ isTrueSet", isTrueSet)

    if (this.staff === true || isTrueSet === true) {
      this.seMuestra = true
    } else {
      this.seMuestra = false
    }
  }

}
