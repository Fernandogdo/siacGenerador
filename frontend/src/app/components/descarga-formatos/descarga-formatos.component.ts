import { Component, OnInit } from '@angular/core';
import { PdfService } from '../../services/creador-pdf/crea-pdf.service';
import { CreaJsonService } from '../../services/creador-json/crea-json.service';
import { CreaDocxService } from '../../services/creador-docx/crea-docx.service';
import { AuthorizationService } from '../../services/login/authorization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-descarga-formatos',
  templateUrl: './descarga-formatos.component.html',
  styleUrls: ['./descarga-formatos.component.css']
})
export class DescargaFormatosComponent implements OnInit {

  blob: any;
  idParamsUrl;
  idUserStorage;
  valor = false;
  tipoDocumento: string;

  constructor(
    public loader: LoadingService,
    private pdfService: PdfService,
    private authorizationService: AuthorizationService,
    public activatedRoute: ActivatedRoute,
    private creaDocxService: CreaDocxService,
    private creaJsonService: CreaJsonService,
  ) { }

  ngOnInit(): void {
    this.idParamsUrl = this.activatedRoute.snapshot.paramMap.get("id_user");
    this.idUserStorage = localStorage.getItem('id_user')
    this.comprobarId();
  }

  comprobarId() {
    this.authorizationService.comprobarId(this.idParamsUrl)
  }

  // Genera PDF Completo
  generaPdfCompleto() {
    this.valor = true;
    this.tipoDocumento = "PDF Completo";
    this.pdfService.generaPdfCompleto(this.idUserStorage).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      window.open(downloadURL)
      this.valor = false;
    });
  }


  // Genera PDF Resumido
  generaPdfResumido() {
    this.valor = true;
    this.tipoDocumento = "PDF Resumido";
    this.pdfService.generaPdfResumido(this.idUserStorage).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      window.open(downloadURL)
      this.valor = false;
    })
  }

  // Genera DOCX Completo
  generaDocCompleto() {
    this.valor = true;
    this.tipoDocumento = "DOCX Completo";
    this.creaDocxService.generaDocCompleto(this.idUserStorage).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/msword' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "doc_completo.docx";
      link.click();
      this.valor = false;
    });
  }

  // Genera DOCX Resumido
  generaDocResumido() {
    this.valor = true;
    this.tipoDocumento = "DOCX Resumido";
    this.creaDocxService.generaDocResumido(this.idUserStorage).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/msword' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "doc_resumido.docx";
      link.click();
      this.valor = false;
    });
  }


  // Genera Json Completo
  generaJsonCompleto() {
    this.valor = true;
    this.tipoDocumento = "JSON Completo";
    this.creaJsonService.generaJsonCompleto(this.idUserStorage).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/json' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "cv_completo.json";
      link.click();
      this.valor = false;
    });
  }

  // Genera Json Resumido
  generaJsonResumido() {
    this.valor = true;
    this.tipoDocumento = "JSON Resumido";
    this.creaJsonService.generaJsonResumido(this.idUserStorage).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/json' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "cv_resumido.json";
      link.click();
      this.valor = false;
    })
  }

}
