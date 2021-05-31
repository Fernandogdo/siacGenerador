import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Inject,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ConfiguracioncvService } from "app/services/configuracioncv.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfiguracioncvPersonalizado } from "app/models/configuracioncvPersonalizado.model";

import html2canvas from "html2canvas";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from "html-to-pdfmake";
import { InfoDocenteService } from "app/services/info-docente/info-docente.service";
import { Docente } from "app/models/docente";
import { jsPDF } from "jspdf";

import * as html2pdf from 'html2pdf.js'
import { PdfService } from "app/services/creador-pdf/crea-pdf.service";
import { HttpClient } from "@angular/common/http";
// import jsPDF from 'jspdf';

// import { jsPDF } from 'jspdf';

import { DOCUMENT } from '@angular/common';
@Component({
  selector: "app-modal-personalizacion",
  templateUrl: "./modal-personalizacion.component.html",
  styleUrls: ["./modal-personalizacion.component.css"],
})
export class ModalPersonalizacionComponent implements OnInit {
  @ViewChild("htmlData") htmlData: ElementRef;

  form: FormGroup;

  idConfiguracion;
  bloque;
  atributo;
  orden;
  visible_cv_personalizado;
  mapeo;
  cv;
  nombre_cv;
  description;

  configuracionPersonalizadaSelected;
  oneConfiguracion: any = [];
  docente: any = [];

  URL_PDF = 'localhost:8000/api/vistapdf/'

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public http: HttpClient,
    public pdfService: PdfService,
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    public infoDocenteService: InfoDocenteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Reactive Form
    this.form = this.fb.group({
      // bloque: ['', Validators.required],
      // atributo: ['', Validators.required],
      visible_cv_personalizado: ["", Validators.required],
      mapeo: ["", Validators.required],
      cv: ["", Validators.required],
      nombre_cv: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.bloque = this.data.bloque;
    console.log("BLOQUE:", this.bloque);
    this.atributo = this.data.atributo;
    console.log("ATRIBUTO:", this.atributo);
    this.mapeo = this.data.mapeo;
    console.log("MAPEO:", this.mapeo);
    // this.configuracionPersonalizadaSelected = this.idConfiguracion;
    // this.getConfiguracion(this.configuracionPersonalizadaSelected)
    // this.PostConfiguracionPersonalizada();
    this.infoDocenteService.getInfoDocente().subscribe((res) => {
      this.docente = res;
      console.log(
        "🚀 ~ file: modal-personalizacion.component.ts ~ line 79 ~ ModalPersonalizacionComponent ~ ngOnInit ~ this.docente",
        this.docente
      );
    });
  }

  PostConfiguracionPersonalizada() {
    console.log(
      "Selected item Id: ",
      this.bloque,
      this.atributo,
      this.mapeo,
      this.form.value.visible_cv_personalizado
    ); // You get the Id of the selected item here
    const configuracionPersonalizada = {
      idDocente: 1,
      bloque: this.bloque,
      atributo: this.atributo,
      // orden: selectedItem.orden,
      visible_cv_personalizado: this.form.value.visible_cv_personalizado,
      mapeo: this.mapeo,
      cv: this.form.value.cv,
      nombre_cv: this.form.value.nombre_cv,
    };

    // if (this.form.value.visible_cv_personalizado = true) {
    this.configuracioncvService
      .postConfiguracionPersonalizada(configuracionPersonalizada)
      .subscribe((res) => {
        console.log("GUARDADOPERSO", res);
      });
    // }
    // else{
    //   console.log('ERROR')
    // }
  }

  public getPDF() {
    //get table html
    const data = this.htmlData.nativeElement;
    //html to pdf format
    var html = htmlToPdfmake(data.innerHTML);

    const documentDefinition = {
      content: [
        html,

        {
          text: "asdsadsadsadsad",
        },
      ],

      styles: {
        titulo: {
          // we define the class called "red"
          color: "red",
          alignment: "center",
        },
        docente:{
          marginLeft: 30
        }
      },
    };
    pdfMake.createPdf(documentDefinition).download();
  }

  public downloadAsPDF() {
    const doc = new jsPDF();

    const pdfTable = this.htmlData.nativeElement;

    var html = htmlToPdfmake(pdfTable.innerHTML);

    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open();
  }

  goToUrl(): void {
    // window.open('http://localhost:8000/api/vistapdf/', '_blank')
    this.document.location.href = 'http://localhost:8000/api/vistapdf/';
  }
}
