import { Component, OnInit } from '@angular/core';
import { CreaBibtexService } from 'app/services/creador-bibtex/crea-bibtex.service';
import { CreaCsvService } from 'app/services/creador-csv/crea-csv.service';
import { CreaTxtService } from 'app/services/creador-txt/crea-txt.service';


@Component({
  selector: 'app-descarga-informacion',
  templateUrl: './descarga-informacion.component.html',
  styleUrls: ['./descarga-informacion.component.css']
})
export class DescargaInformacionComponent implements OnInit {

  idUserStorage;
  blob: any;
  // valor = false;
  valor: boolean;
  valorNombre;
  tipoDocumento;

  constructor(
    private creatxtService: CreaTxtService,
    private creaCsvService: CreaCsvService,
    private creaBibtexService: CreaBibtexService
  ) { }

  ngOnInit(): void {
    this.idUserStorage = localStorage.getItem("id_user");

  }


  generaTxtArticulos(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "TXT"

    this.creatxtService.generaTxtArticulos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "articulos_informacion_txt.txt";
      link.click();
      this.valor = false;
    })
  }


  generaTxtLibros(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "TXT"

    this.creatxtService.generaTxtLibros(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "libros_informacion_txt.txt";
      link.click();
      this.valor = false;
    });
  }

  generaTxtProyectos(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "TXT"

    this.creatxtService.generaTxtProyectos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "proyectos_informacion_txt.txt";
      link.click();
      this.valor = false;
    });
  }

  generaTxtCapacitacion(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "TXT"

    this.creatxtService.generaTxtCapacitacion(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "capacitaciones_informacion_txt.txt";
      link.click();
      this.valor = false;
    });
  }


  generaTxtGradoAcademico(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "TXT"

    this.creatxtService.generaTxtGradoAcademico(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "gradoAcademico_informacion_txt.txt";
      link.click();
      this.valor = false;
    });
  }


  generaCsvArticulos(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "CSV"

    this.creaCsvService.generaCsvArticulos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "articulos_informacion_csv.csv";
      link.click();
      this.valor = false;
    });
  }

  generaCsvLibros(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "CSV"

    this.creaCsvService.generaCsvLibros(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "libros_informacion_csv.csv";
      link.click();
      this.valor = false;
    });
  }

  generaCsvProyectos(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "CSV"

    this.creaCsvService.generaCsvProyectos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "proyectos_informacion_csv.csv";
      link.click();
      this.valor = false;
    });
  }


  generaCsvCapacitacion(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "CSV"

    this.creaCsvService.generaCsvCapacitacion(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "capacitaciones_informacion_csv.csv";
      link.click();
      this.valor = false;
    });
  }

  generaCsvGradoAcademico(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "CSV"

    this.creaCsvService.generaCsvGradoAcademico(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "gradoAcademico_informacion_csv.csv";
      link.click();
      this.valor = false;
    });
  }



  generaBibArticulos(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "BibTex"

    this.creaBibtexService.generaBibArticulos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "articulos_informacion_bib.bib";
      link.click();
      this.valor = false;
    });
  }

  generaBibLibros(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "BibTex"

    this.creaBibtexService.generaBibLibros(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "libros_informacion_bib.bib";
      link.click();
      this.valor = false;
    });
  }

  generaBibProyectos(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "BibTex"

    this.creaBibtexService.generaBibProyectos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "proyectos_informacion_bib.bib";
      link.click();
      this.valor = false;
    });
  }

  generaBibCapacitacion(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "BibTex"
    
    this.creaBibtexService.generaBibCapacitacion(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "capacitacion_informacion_bib.bib";
      link.click();
      this.valor = false;
    });
  }

  generaBibGradoAcademico(nombre_cv) {
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "BibTex"

    this.creaBibtexService.generaBibGradoAcademico(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "grado-academico_informacion_bib.bib";
      link.click();
      this.valor = false;
    });
  }


}
