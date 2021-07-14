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
import { LibrosService } from 'app/services/libros.service';
import { Angular2CsvModule } from 'angular2-csv';
import { ArticulosService } from 'app/services/articulos.service';

@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.component.html',
  styleUrls: ['./guardados.component.css']
})
export class GuardadosComponent implements OnInit {

  arreglo = [];
  confPersoDocente;
  confPersoDocenteClas = [];
  arregloArticulos = []
  dataDocente;
  docente: Usuario[];
  idUser;
  
  blob: any;
  pdfGenerado: any;
  
  // dialogEditCategoria: MatDialogRef<ModalPersonalizacionComponent>;

  constructor(
    public configuracioncvService: ConfiguracioncvService,
    public infoDocenteService: InfoDocenteService,
    public librosService: LibrosService,
    public articulosService: ArticulosService,
    public pdfService: PdfService,
    public creaJsonService: CreaJsonService,
    public creaDocxService: CreaDocxService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  

  ngOnInit(): void {
    this.idUser = this.activatedRoute.snapshot.paramMap.get("id_user");
    console.log('IDUDOCENTEIDDOCENTE-------------_>>>>>>>>>>>>>>>>>>>>>>>>', this.idUser)
    // this.infoDocenteService.getInfoDocente(this.idUser);
    this.librosService.getDocente(this.idUser)
    this.librosService.getLibros().subscribe(res =>{
      console.log(res)
    })

    this.getConfiguracionPersonalizada()
    this.getConfigurcionPersonalizadaDocente()
    this.getLibros();
  }

  options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    headers: ['Article Title', 'Journal Title', 'ISSN', 'ISBN', 'Publication Date', 'Volume', 'ISSUE', 'Pages', 'DOI', 'Doctype', 'Keywords'],
    showTitle: true,
    title: '',
    useBom: false,
    removeNewLines: true,
    keys: ['titulo','revista','issn', 'isbn', 'fecha_publicacion', 'volume', 'issue','pages','doi', 'tipo_documento', 'keywords']
  };
  
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

  generaPdfCompleto(){
    this.pdfService.generaPdfCompleto(this.idUser).subscribe((data) => {

      this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
    
      var downloadURL = window.URL.createObjectURL(data);
      window.open(downloadURL)

      // var link = document.createElement('a');
      // link.href = downloadURL;
      // link.download = "pdf-completo.pdf";
      // link.click();
    })
  }


  generaPdfResumido(){
    this.pdfService.generaPdfResumido(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      window.open(downloadURL)
      
      // var link = document.createElement('a');
      
      
      // link.href = downloadURL;
      // link.download = "pdf-resumido.pdf";
      // link.click();
    })
  }

  generaPdfPersonalizado(){
    this.pdfService.generaPdfPersonalizado(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      window.open(downloadURL)
    })
  }

  generaDocCompleto(){
    this.creaDocxService.generaDocCompleto(this.idUser).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'application/msword'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "doc_completo.docx";
      link.click();
    })

  }

  generaDocResumido(){

  }

  generaJsonCompleto(){
    this.creaJsonService.generaJsonCompleto(this.idUser).subscribe((data) =>{
      this.blob = new Blob([data as BlobPart], {type: 'application/json'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "cv_completo.json";
      link.click();
    });
  }

  generaJsonResumido(){
    this.creaJsonService.generaJsonResumido(this.idUser).subscribe((data) =>{
      console.log(data);
      this.blob = new Blob([data as BlobPart], {type: 'application/json'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "cv_resumido.json";
      link.click();
    }) 
  }

  
  generaTxt(){
    //  this.blob = new Blob([data as BlobPart], {type: 'application/json'});
    //   var downloadURL = window.URL.createObjectURL(data);
    //   console.log(downloadURL)
    //   var link = document.createElement('a');
    //   link.href = downloadURL;
    //   link.download = "cv_resumido.json";
    //   link.click();
  }
  
  getLibros(){
    this.librosService.getDocente(this.idUser).subscribe(res =>{
      console.log('INFODOCENTE', res)
      this.dataDocente = res['related'];
      this.getArticulos(this.dataDocente)
    });
  }

  getArticulos(dataDocente){
    let claves = Object.values(dataDocente['articulos']);
    for(let i=0; i< claves.length; i++){
      const acceso = claves[i]
      let keys_atributos_todos = Object.values(acceso);

      for (let index = 0; index < keys_atributos_todos.length; index++) {
        const element = keys_atributos_todos[index];
        console.log(element)
        
        this.articulosService.getArticulos(element).subscribe(res =>{
          console.log(res)
          this.arregloArticulos.push(Object(res))
          console.log(this.arregloArticulos)

        });
      }
    }
  }

  



  


}
