import { Component, OnInit } from '@angular/core';
import { PdfService } from 'app/services/creador-pdf/crea-pdf.service';
import { CreaJsonService } from 'app/services/creador-json/crea-json.service';
import { CreaDocxService } from 'app/services/creador-docx/crea-docx.service';
import { AuthorizationService } from 'app/services/login/authorization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import { LoadingService } from 'app/services/loading/loading.service';

@Component({
  selector: 'app-descarga-formatos',
  templateUrl: './descarga-formatos.component.html',
  styleUrls: ['./descarga-formatos.component.css']
})
export class DescargaFormatosComponent implements OnInit {

  blob: any;
  idParamsUrl;
  idUserStorage;

  constructor(
    public loader: LoadingService,
    private pdfService: PdfService,
    private authorizationService:AuthorizationService,
    public activatedRoute:ActivatedRoute,
    private creaDocxService: CreaDocxService,
    private creaJsonService: CreaJsonService,
    private configuracion: ConfiguracioncvService
  ) { }

  ngOnInit(): void {
    this.idParamsUrl = this.activatedRoute.snapshot.paramMap.get("id_user");
    this.idUserStorage = localStorage.getItem('id_user')
    console.log("🚀 ~ file: crea-formatos.component.ts ~ line 34 ~ CreaFormatosComponent ~ ngOnInit ~ this.idUserStorage", this.idUserStorage)
    
    this.comprobarId();
    // this.authorizationService.enviarIdUsuario(this.idUser)
    console.log('IDUDOCENTEIDDOCENTE-------------_>>>>>>>>>>>>>>>>>>>>>>>>', this.idParamsUrl)
    // this.generaInformacion();
    this.docente();
    this
  }

  comprobarId(){
    this.authorizationService.comprobarId(this.idParamsUrl)
    console.log("IDUSERGUARDADO", this.idParamsUrl, localStorage.getItem("id_user"))
    // if (this.idParamsUrl != this.idUserStorage) {
    //   console.log("NOSONIGUALES", this.idUserStorage, this.idParamsUrl)
    //   this.authorizationService.cerrarSesionDocente()
    // } else{
    //   console.log("SONIGUALES")
    // }
  }

  // fetchUser(){
    
  // }


  generaPdfCompleto(){
    console.log("PDFCOMPLETO")
    this.pdfService.generaPdfCompleto(this.idUserStorage).subscribe((data) => {

      this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
    
      var downloadURL = window.URL.createObjectURL(data);
      console.log("🚀 ~ file: crea-formatos.component.ts ~ line 40 ~ CreaFormatosComponent ~ this.pdfService.generaPdfCompleto ~ downloadURL", downloadURL)
      window.open(downloadURL)

      // var link = document.createElement('a');
      // link.href = downloadURL;
      // link.download = "pdf-completo.pdf";
      // link.click();
    })
  }


  generaPdfResumido(){
    this.pdfService.generaPdfResumido(this.idUserStorage).subscribe((data) => {
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


  generaDocCompleto(){
    this.creaDocxService.generaDocCompleto(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'application/msword'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "doc_completo.docx";
      link.click();
    });
  }

  generaDocResumido(){
    this.creaDocxService.generaDocResumido(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'application/msword'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "doc_resumido.docx";
      link.click();
    });
  }


  generaJsonCompleto(){
    this.creaJsonService.generaJsonCompleto(this.idUserStorage).subscribe((data) =>{
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
    this.creaJsonService.generaJsonResumido(this.idUserStorage).subscribe((data) =>{
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


  // generaInformacion(){
  //   console.log("ARITUCLOSINFO")
  //   this.configuracion.getArticulos().subscribe((res=>{
  //     console.log("INFOARTICULOS", res)
  //   }))
  // }

  docente(){
    // let idUsuario =   parseInt(localStorage.getItem('id_user'));

    console.log("DOCENRE");
    this.configuracion.getDocente(this.idUserStorage).subscribe((res=>{
      console.log("DOCENTE", res)
    }))
  }

}
