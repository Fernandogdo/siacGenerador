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
import { CreaBibtexService } from 'app/services/creador-bibtex/crea-bibtex.service';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner'
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner'


@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.component.html',
  styleUrls: ['./guardados.component.css'],
  // providers: [Ng4LoadingSpinnerService]
})
export class GuardadosComponent implements OnInit {

  
  // value = 50;
  // bufferValue = 75;

  arreglo = [];
  confPersoDocente;
  confPersoDocenteClas = [];
  confPersoDocenteClasFormateadas = []
  // arregloArticulos = []
  dataDocente;
  docente: Usuario[];
  idUser;
  
  blob: any;
  pdfGenerado: any;
  isLoading = false;
  loadingText: string = '';

  valor = false;
  valorDocumento = false;



  

  
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
    public creabibtexService: CreaBibtexService,
    private _snackBar: MatSnackBar,
    // private spinner: Ng4LoadingSpinnerService
  ) { 
    // spinner.show();
    // setTimeout(() => {
    //   spinner.hide();
    // }
    //   , 2000)
  }

  

  ngOnInit(): void {
    
    this.idUser = this.activatedRoute.snapshot.paramMap.get("id_user");
    this.authorizationService.enviarIdUsuario(this.idUser)
    console.log('IDUDOCENTEIDDOCENTE-------------_>>>>>>>>>>>>>>>>>>>>>>>>', this.idUser)
    // this.infoDocenteService.getInfoDocente(this.idUser);
    // this.librosService.getDocente(this.idUser)
    // let dateFormat = require('dateformat');
    let now = new Date();
    // dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    console.log('HORAFECHA', now)
    
    

    // this.getConfiguracionPersonalizada()
    this.getConfigurcionPersonalizadaDocente()
    // this.getLibros();
    this.configuracioncvService.getJSON().subscribe(res=>{
      console.log(res)
    })

  }

  // showSpinner(time?) {
  //   console.log(time);
  //   this.spinner.show();
  //   if (time !== null) {
  //     this.loadingText = 'Spin for 5 seconds';
  //     setTimeout(() => {
  //       this.spinner.hide();
  //     }
  //       , 2000)
  //   } else{
  //     this.loadingText = 'Spin for unlimited times';
      
  //   }
  // }


  // showSpinner(time?) {
  //   console.log(time);
  //   this.spinner.show();
  //   if (time !== null) {
  //     this.loadingText = 'Spin for 5 seconds';
  //     setTimeout(() => {
  //       this.spinner.hide();
  //     }
  //       , 2000)
  //   } else{
  //     this.loadingText = 'Spin for unlimited times';
      
  //   }
  // }


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

        // const filteredCategories = [];
        // data.forEach(configuracion => {
        //   if (!filteredCategories.find(cat => cat.nombre_cv == configuracion.nombre_cv && cat.atributo == configuracion.atributo)) {
        //     const { id, nombre_cv, bloque, atributo, visible_cv_personalizado, mapeo, cv, id_user} = configuracion;
        //     filteredCategories.push({ id, nombre_cv, bloque, atributo, visible_cv_personalizado, mapeo, cv, id_user});
        //   }
        // });

        // this.configuracioncvService.configuracionesPersonalizadas = filteredCategories;

        this.arreglo = data.reduce(function (r, a) {
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
        console.log("🚀 ~ file: guardados.component.ts ~ line 198 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ confPersoDocente", confPersoDocente)
       
        
        // _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
        // let data  = _.orderBy(confPersoDocente, ['fecha_registro'], ['desc'])
        // console.log("DATAORDENADAFECHA", confPersoDocente)

        this.confPersoDocenteClas = _.groupBy(this.confPersoDocente, (item) => {
          return [item['nombre_cv'], item['cv'], item['fecha_registro']];
      });

      this.confPersoDocenteClas =  _.orderBy(_.keys(this.confPersoDocenteClas), (item) => {
        return item.split(',')[2];
      }, ['desc']).map(item => {
        return {
          [item]: this.confPersoDocenteClas[item]
        }
      });


      console.log("🚀 ~ file: guardados.component.ts ~ line 217 ~ GuardadosComponent ~ this.confPersoDocenteClas=_.orderBy ~ this.confPersoDocenteClas", this.confPersoDocenteClas)

      

      this.confPersoDocenteClasFormateadas = this.confPersoDocenteClas.map((item) => {
        let fecha_registro;
        let cv;
        let data;
      
        Object.keys(item).forEach((entry, index) => {

          fecha_registro = entry.split(',')[2]
          // First index is the month
          // if (index === 0) {
          //   fecha_registro = item[entry];
          // }
      
          // Second index is the name but this time we need the key
          // and also its value gives you the data
          if (index === 0) {
            cv = entry;
            console.log("NAME",cv)
            data = item[entry];
            console.log('data', data)

            // nombre_cv = entry;
            // data = item[entry];
          }
        });
        return {cv, data };
      });
      
       
      
      console.log("🚀 ~ file: guardados.component.ts ~ line 208 ~ GuardadosComponent ~ this.confPersoDocenteClas=_.groupBy ~ this.confPersoDocenteClas", this.confPersoDocenteClasFormateadas)
      
      // this.confPersoDocenteClas = _.reverse(Object.values(this.confPersoDocenteClas)).reduce((obj, group) => {
      //   // iteramos sobre las listas para generar el 'key' necesario
      //   const item = group[0] // Cada grupo tiene al menos un item
      //   obj[`${item['nombre_cv']},${item['cv']},${item['fecha_registro']}`] = group // recreamos la key
      //   return obj
      // }, {});


      // console.log("🚀 ~ file: guardados.component.ts ~ line 207 ~ GuardadosComponent ~ this.confPersoDocenteClas=_.groupBy ~ this.confPersoDocenteClas", this.confPersoDocenteClas)
      // console.log(Object.keys(this.confPersoDocenteClas))


      // console.log("🚀 ~ file: guardados.component.ts ~ line 59 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ res",  data);
      // console.log("TRAEDENUEVOTODO");

      })

  }


  deleteConfiguracionPersonalizada(nombreCv, cvHash){
    console.log("AELIMINAR", nombreCv)
    // console.log("🚀 ~ file: guardados.component.ts ~ line 108 ~ GuardadosComponent ~ getConfiguracionPersonalizada ~ arreglo", this.confPersoDocente)

    let datos = _.filter(this.confPersoDocente, { 'nombre_cv': nombreCv, 'cv': cvHash });
    console.log(datos)

    datos.forEach((element) => {
      console.log(element.id)
      this.configuracioncvService.deleteConfiguracionPersonalizada(element.id)
      .subscribe((res)=>{
      
      // console.log("🚀 ~ file: guardados.component.ts ~ line 135 ~ GuardadosComponent ~ this.configuracioncvService.deleteConfiguracionPersonalizada ~ res", res)
      this.getConfigurcionPersonalizadaDocente()

      });

      this._snackBar.open("Se eliminó " + nombreCv, "Cerrar", {
        duration: 2000,
      });
      
      
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

  generaPdfPersonalizado(nombre_cv, cvHash){
    console.log("NOMBRECV", nombre_cv, this.idUser, this.valor, cvHash)
    this.valor = true;
    this.pdfService.generaPdfPersonalizado(this.idUser, nombre_cv, cvHash).subscribe((data) => {
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

  generaDocPersonalizado(nombre_cv, cvHash){
    console.log("DOCPERSO", nombre_cv);
    this.creaDocxService.generaDocPersonalizado(this.idUser, nombre_cv, cvHash).subscribe((data) =>{
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

  generaJsonPersonalizado(nombre_cv, cvHash){
    this.creaJsonService.generaJsonPersonalizado(this.idUser, nombre_cv, cvHash).subscribe((data) =>{
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
    this.valorDocumento = true;

    this.creatxtService.generaTxtArticulos(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "articulos_informacion_txt.txt";
      link.click();
      this.valorDocumento = false;

    })
  }


  generaTxtLibros(){
    this.valorDocumento = true;
    this.creatxtService.generaTxtLibros(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "libros_informacion_txt.txt";
      link.click();
      this.valorDocumento = false;

    });
  }

  generaTxtProyectos(){
    this.valorDocumento = true;
    this.creatxtService.generaTxtProyectos(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "proyectos_informacion_txt.txt";
      link.click();
      this.valorDocumento = false;

    });
  }

  generaTxtCapacitacion(){
    this.valorDocumento = true;
    this.creatxtService.generaTxtCapacitacion(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "capacitaciones_informacion_txt.txt";
      link.click();
      this.valorDocumento = false;

    });
  }


  generaTxtGradoAcademico(){
    this.valorDocumento = true;
    this.creatxtService.generaTxtGradoAcademico(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "gradoAcademico_informacion_txt.txt";
      link.click();
      this.valorDocumento = false;

    });
  }


  generaBibtex(){
    this.creabibtexService.generaBibtex(this.idUser).subscribe((data) =>{
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "informacion.bib";
      link.click();
    })
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
