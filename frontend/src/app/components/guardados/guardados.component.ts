import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvPersonalizado } from 'app/models/configuracioncvPersonalizado.model';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import * as _ from "lodash";
// import { ModalPersonalizacionComponent } from '../modal-personalizacion/modal-personalizacion.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InfoDocenteService } from 'app/services/info-docente/info-docente.service';
import { PdfService } from 'app/services/creador-pdf/crea-pdf.service';
// import { Docente } from 'app/models/docente';
import { Usuario } from 'app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { CreaJsonService } from 'app/services/creador-json/crea-json.service';
import { CreaDocxService } from 'app/services/creador-docx/crea-docx.service';
// import { LibrosService } from 'app/services/libros.service';
import { Angular2CsvModule } from 'angular2-csv';
// import { ArticulosService } from 'app/services/articulos.service';
import { CreaCsvService } from 'app/services/creador-csv/crea-csv.service';
import { CreaTxtService } from 'app/services/creador-txt/crea-txt.service';
import { AuthorizationService } from 'app/services/login/authorization.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.component.html',
  styleUrls: ['./guardados.component.css']
})
export class GuardadosComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  valor = false;
  // value = 50;
  // bufferValue = 75;

  arreglo = [];
  confPersoDocente;
  confPersoDocenteClas = [];
  // arregloArticulos = []
  dataDocente;
  docente: Usuario[];
  idUser;
  
  blob: any;
  pdfGenerado: any;
  
  // dialogEditCategoria: MatDialogRef<ModalPersonalizacionComponent>;

  constructor(
    public configuracioncvService: ConfiguracioncvService,
    public infoDocenteService: InfoDocenteService,
    // public librosService: LibrosService,
    // public articulosService: ArticulosService,
    public pdfService: PdfService,
    public creaJsonService: CreaJsonService,
    public creaDocxService: CreaDocxService,
    public creacvService: CreaCsvService,
    public creatxtService: CreaTxtService,
    private activatedRoute: ActivatedRoute,
    public authorizationService: AuthorizationService,
    private _snackBar: MatSnackBar,
  ) { }

  

  ngOnInit(): void {
    this.idUser = this.activatedRoute.snapshot.paramMap.get("id_user");
    this.authorizationService.enviarIdUsuario(this.idUser)
    console.log('IDUDOCENTEIDDOCENTE-------------_>>>>>>>>>>>>>>>>>>>>>>>>', this.idUser)
    // this.infoDocenteService.getInfoDocente(this.idUser);
    // this.librosService.getDocente(this.idUser)

    this.getConfiguracionPersonalizada()
    this.getConfigurcionPersonalizadaDocente()
    // this.getLibros();
    this.configuracioncvService.getJSON().subscribe(res=>{
      console.log(res)
    })
  }

  // barButtonOptions: any = {
  //   active: false,
  //   text: 'Progress Bar Button',
  //   buttonColor: 'accent',
  //   barColor: 'primary',
  //   raised: true,
  //   mode: 'indeterminate',
  //   value: 0
  // }

  // options = {
  //   fieldSeparator: ',',
  //   quoteStrings: '"',
  //   decimalseparator: '.',
  //   showLabels: false,
  //   headers: ['Article Title', 'Journal Title', 'ISSN', 'ISBN', 'Publication Date', 'Volume', 'ISSUE', 'Pages', 'DOI', 'Doctype', 'Keywords'],
  //   showTitle: true,
  //   title: '',
  //   useBom: false,
  //   removeNewLines: true,
  //   keys: ['titulo','revista','issn', 'isbn', 'fecha_publicacion', 'volume', 'issue','pages','doi', 'tipo_documento', 'keywords']
  // };
  
  getConfiguracionPersonalizada() {
    this.configuracioncvService.getConfiguracionesPersonalizadas()
      .subscribe(res => {
        let data = res.filter(data => data.visible_cv_personalizado === true)
        this.configuracioncvService.configuracionesPersonalizadas = data;

        const filteredCategories = [];
        data.forEach(configuracion => {
          if (!filteredCategories.find(cat => cat.nombre_cv == configuracion.nombre_cv && cat.atributo == configuracion.atributo)) {
            const { id, nombre_cv, bloque, atributo, visible_cv_personalizado, mapeo, cv, id_user} = configuracion;
            filteredCategories.push({ id, nombre_cv, bloque, atributo, visible_cv_personalizado, mapeo, cv, id_user});
          }
        });

        this.configuracioncvService.configuracionesPersonalizadas = filteredCategories;

        this.arreglo = filteredCategories.reduce(function (r, a) {
          r[a.nombre_cv] = r[a.nombre_cv] || [];
          r[a.nombre_cv].push(a);
          return r;
        }, Object.create(null));

        console.log('RESUKLTRESUKT', this.arreglo);
      }),
      err => console.log(err);
  }

  getConfigurcionPersonalizadaDocente(){
    let iduser =  localStorage.getItem("id_user");
    // console.log("🚀 ~ file: guardados.component.ts ~ line 55 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ iduser", iduser)
    
    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente =>{
        this.confPersoDocente = confPersoDocente;
        this.confPersoDocenteClas = _.groupBy(confPersoDocente, "nombre_cv");
      // console.log("🚀 ~ file: guardados.component.ts ~ line 59 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ res",  this.confPersoDocenteClas)
      })
  }


  deleteConfiguracionPersonalizada(nombreCv){
    console.log("AELIMINAR", nombreCv)
    console.log("🚀 ~ file: guardados.component.ts ~ line 108 ~ GuardadosComponent ~ getConfiguracionPersonalizada ~ arreglo", this.confPersoDocente)

    let datos = _.filter(this.confPersoDocente, ['nombre_cv', nombreCv]);
    console.log(datos)

    datos.forEach((element) => {
      console.log(element.id)
      this.configuracioncvService.deleteConfiguracionPersonalizada(element.id).subscribe((res)=>{
      console.log("🚀 ~ file: guardados.component.ts ~ line 135 ~ GuardadosComponent ~ this.configuracioncvService.deleteConfiguracionPersonalizada ~ res", res)
      
      });

      this._snackBar.open("Se elimino " + nombreCv, "Cerrar", {
        duration: 2000,
      });
      
      this.getConfigurcionPersonalizadaDocente();
    });
  }


  // generaPdfCompleto(){
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

  generaPdfPersonalizado(nombre_cv){
    console.log("NOMBRECV", nombre_cv, this.idUser, this.valor)
    this.valor = true;
    this.pdfService.generaPdfPersonalizado(this.idUser, nombre_cv).subscribe((data) => {
      // this.valor = true;
      this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL);
      window.open(downloadURL);
      this.valor = false;
    });
    // console.log("VALORSPINNER", this.valor)
  }


  // generaDocCompleto(){
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

  generaDocPersonalizado(nombre_cv){
    console.log("DOCPERSO", nombre_cv);
    this.creaDocxService.generaDocPersonalizado(this.idUser, nombre_cv).subscribe((data) =>{
      this.blob = new Blob([data as BlobPart], {type: 'application/msword'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "doc_personalizado.docx";
      link.click();
    });
  }

  // generaJsonCompleto(){
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

  generaJsonPersonalizado(nombre_cv){
    this.creaJsonService.generaJsonPersonalizado(this.idUser, nombre_cv).subscribe((data) =>{
      console.log(data);
      this.blob = new Blob([data as BlobPart], {type: 'application/json'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "cv_personalizado.json";
      link.click();
    });
  }


  generaCvInformacion(){
    this.creacvService.generaCsv(this.idUser).subscribe((data) =>{
      this.blob = new Blob([data as BlobPart], {type: 'text/csv'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "indormacion_csv.csv";
      link.click();
    });
  }


  generaTxtInformacion(){  
    this.creatxtService.generaTxtArticulos(this.idUser).subscribe((data) =>{
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "indormacion_txt.txt";
      link.click();
    });
  }


  generaTxtArticulos(){
    this.creatxtService.generaTxtArticulos(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "articulos_informacion_txt.txt";
      link.click();
    })
  }


  generaTxtLibros(){
    this.creatxtService.generaTxtLibros(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "libros_informacion_txt.txt";
      link.click();
    });
  }
 

  // getLibros(){
  //   this.librosService.getDocente(this.idUser).subscribe(res =>{
  //     console.log('INFODOCENTE', res)
  //     this.dataDocente = res['related'];
  //     this.getArticulos(this.dataDocente)
  //   });
  // }
  

  // getArticulos(dataDocente){
  //   let claves = Object.values(dataDocente['articulos']);
  //   for(let i=0; i< claves.length; i++){
  //     const acceso = claves[i]
  //     let keys_atributos_todos = Object.values(acceso);

  //     for (let index = 0; index < keys_atributos_todos.length; index++) {
  //       const element = keys_atributos_todos[index];
  //       console.log(element)
        
  //       this.articulosService.getArticulos(element).subscribe(res =>{
  //         console.log(res)
  //         this.arregloArticulos.push(Object(res))
  //         console.log(this.arregloArticulos)

  //       });
  //     }
  //   }
  // }

}
