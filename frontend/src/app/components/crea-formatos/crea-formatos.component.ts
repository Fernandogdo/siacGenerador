import { Component, OnInit } from '@angular/core';
import { PdfService } from 'app/services/creador-pdf/crea-pdf.service';
import { CreaJsonService } from 'app/services/creador-json/crea-json.service';
import { CreaDocxService } from 'app/services/creador-docx/crea-docx.service';
import { AuthorizationService } from 'app/services/login/authorization.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-crea-formatos',
  templateUrl: './crea-formatos.component.html',
  styleUrls: ['./crea-formatos.component.css']
})
export class CreaFormatosComponent implements OnInit {

  blob: any;
  idUser;


  constructor(
    private pdfService: PdfService,
    private authorizationService:AuthorizationService,
    public activatedRoute:ActivatedRoute,
    private creaDocxService: CreaDocxService,
    private creaJsonService: CreaJsonService
  ) { }

  ngOnInit(): void {
    this.idUser = this.activatedRoute.snapshot.paramMap.get("id_user");
    this.authorizationService.enviarIdUsuario(this.idUser)
    console.log('IDUDOCENTEIDDOCENTE-------------_>>>>>>>>>>>>>>>>>>>>>>>>', this.idUser)
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


  generaDocCompleto(){
    this.creaDocxService.generaDocCompleto(this.idUser).subscribe((data) => {
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
    this.creaDocxService.generaDocResumido(this.idUser).subscribe((data) => {
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

}