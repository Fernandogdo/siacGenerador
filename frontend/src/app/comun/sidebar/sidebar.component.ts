import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import { AuthorizationService } from 'app/services/login/authorization.service';
import { PdfService } from 'app/services/creador-pdf/crea-pdf.service';
import { CreaJsonService } from 'app/services/creador-json/crea-json.service';
import { CreaCsvService } from 'app/services/creador-csv/crea-csv.service';
import { CreaDocxService } from 'app/services/creador-docx/crea-docx.service';
import { CreaTxtService } from 'app/services/creador-txt/crea-txt.service';

import { ActivatedRoute, Router } from '@angular/router';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '',},
    { path: '/administrador', title: 'Administrador',  icon:'person', class: '' },
    { path: '/cv-completo', title: 'Configuración CV Completo',  icon:'account_box', class: '' },
    { path: '/cv-resumido', title: 'Configuración CV Resumido',  icon:'contact_page', class: '' },
    { path: '/cv-guardado', title: 'CVs Personalizados',  icon:'manage_accounts', class: '' },
    { path: '/crea-formatos', title: 'Descargar Formatos',  icon:'manage_accounts', class: ''},
    { path: '/cv-personalizado', title: 'Cear cv Personalizado',  icon:'person', class: ''},
    { path: '/edita-personalizado',title: 'Editar cv Personalizado', icon:'person', class: ''},
    { path: '/descarga-informacion', title: 'Descarga Información',  icon:'notifications', class: '' },
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

  menuItems: any[];
  seMuestra: Boolean
  userdata;
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
  ) { }

  ngOnInit() {
    this.idUser = localStorage.getItem("id_user");
    this.nombreCv = localStorage.getItem("nombre_cv");

    console.log('IDUDOCENTEIDDOCENTE-------------_>>>>>>>>>>>>>>>>>>>>>>>>', this.idUser)
    this.authorizationService.obtenerIdDocente()
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.getRol()
    // this.getConfiguracionPersonalizada()
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
            console.log("ROLUSER",this.seMuestra)
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

  // getConfiguracionPersonalizada() {
  //   this.configuracioncvService.getConfiguracionesPersonalizadas()
  //     .subscribe(res => {
  //       let data = res.filter(data => data.visible_cv_personalizado === true)
  //       this.configuracioncvService.configuracionesPersonalizadas = data;

  //       const filteredCategories = [];
  //       data.forEach(configuracion => {
  //         if (!filteredCategories.find(cat => cat.nombre_cv == configuracion.nombre_cv && cat.atributo == configuracion.atributo)) {
  //           const { id, nombre_cv, bloque, atributo, visible_cv_personalizado, mapeo, cv, id_user} = configuracion;
  //           filteredCategories.push({ id, nombre_cv, bloque, atributo, visible_cv_personalizado, mapeo, cv, id_user});
  //         }
  //       });

  //       this.configuracioncvService.configuracionesPersonalizadas = filteredCategories;

  //       this.arreglo = filteredCategories.reduce(function (r, a) {
  //         r[a.nombre_cv] = r[a.nombre_cv] || [];
  //         r[a.nombre_cv].push(a);
  //         return r;
  //       }, Object.create(null));

  //       console.log('RESUKLTRESUKT', this.arreglo);
  //     }),
  //     err => console.log(err);
  // }

  // generaPdfCompleto(){
  //   this.idUser = localStorage.getItem("idDocente");
  //   this.pdfService.generaPdfCompleto(this.idUser).subscribe((data) => {

  //     this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
    
  //     var downloadURL = window.URL.createObjectURL(data);
  //     window.open(downloadURL)

  //     // var link = document.createElement('a');
  //     // link.href = downloadURL;
  //     // link.download = "pdf-completo.pdf";
  //     // link.click();
  //   })
  // }


  // generaPdfResumido(){
  //   this.idUser = localStorage.getItem("idDocente");
  //   this.pdfService.generaPdfResumido(this.idUser).subscribe((data) => {
  //     this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
  //     var downloadURL = window.URL.createObjectURL(data);
  //     console.log(downloadURL)
  //     window.open(downloadURL)
      
  //     // var link = document.createElement('a');
      
      
  //     // link.href = downloadURL;
  //     // link.download = "pdf-resumido.pdf";
  //     // link.click();
  //   })
  // }

  // generaDocCompleto(){
  //   this.idUser = localStorage.getItem("idDocente");
  //   this.creaDocxService.generaDocCompleto(this.idUser).subscribe((data) => {
  //     this.blob = new Blob([data as BlobPart], {type: 'application/msword'});
  //     var downloadURL = window.URL.createObjectURL(data);
  //     console.log(downloadURL)
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = "doc_completo.docx";
  //     link.click();
  //   });
  // }

  // generaDocResumido(){
  //   this.idUser = localStorage.getItem("idDocente");
  //   this.creaDocxService.generaDocResumido(this.idUser).subscribe((data) => {
  //     this.blob = new Blob([data as BlobPart], {type: 'application/msword'});
  //     var downloadURL = window.URL.createObjectURL(data);
  //     console.log(downloadURL)
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = "doc_resumido.docx";
  //     link.click();
  //   });
  // }

  // generaJsonCompleto(){
  //   this.idUser = localStorage.getItem("idDocente");
  //   this.creaJsonService.generaJsonCompleto(this.idUser).subscribe((data) =>{
  //     this.blob = new Blob([data as BlobPart], {type: 'application/json'});
  //     var downloadURL = window.URL.createObjectURL(data);
  //     console.log(downloadURL)
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = "cv_completo.json";
  //     link.click();
  //   });
  // }

  // generaJsonResumido(){
  //   this.idUser = localStorage.getItem("idDocente");
  //   this.creaJsonService.generaJsonResumido(this.idUser).subscribe((data) =>{
  //     console.log(data);
  //     this.blob = new Blob([data as BlobPart], {type: 'application/json'});
  //     var downloadURL = window.URL.createObjectURL(data);
  //     console.log(downloadURL)
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = "cv_resumido.json";
  //     link.click();
  //   }) 
  // }


  // generaCvInformacion(){
  //   this.idUser = localStorage.getItem("idDocente");
  //   this.creacvService.generaCsv(this.idUser).subscribe((data) =>{
  //     this.blob = new Blob([data as BlobPart], {type: 'text/csv'});
  //     var downloadURL = window.URL.createObjectURL(data);
  //     console.log(downloadURL)
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = "indormacion_csv.csv";
  //     link.click();
  //   });
  // }

  // generaTxtInformacion(){ 
  //   this.idUser = localStorage.getItem("idDocente"); 
  //   this.creatxtService.generaTxtArticulos(this.idUser).subscribe((data) =>{
  //     this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
  //     var downloadURL = window.URL.createObjectURL(data);
  //     console.log(downloadURL)
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = "indormacion_txt.txt";
  //     link.click();
  //   });
  // }

  // generaTxtArticulos(){
  //   this.idUser = localStorage.getItem("idDocente");
  //   this.creatxtService.generaTxtArticulos(this.idUser).subscribe((data) => {
  //     this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
  //     var downloadURL = window.URL.createObjectURL(data);
  //     console.log(downloadURL)
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = "articulos_informacion_txt.txt";
  //     link.click();
  //   })
  // }

  // generaTxtLibros(){
  //   this.idUser = localStorage.getItem("idDocente");
  //   this.creatxtService.generaTxtLibros(this.idUser).subscribe((data) => {
  //     this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
  //     var downloadURL = window.URL.createObjectURL(data);
  //     console.log(downloadURL)
  //     var link = document.createElement('a');
  //     link.href = downloadURL;
  //     link.download = "libros_informacion_txt.txt";
  //     link.click();
  //   });
  // }

}
