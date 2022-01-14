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
  valorDocumento = false;

  constructor(
    private creatxtService: CreaTxtService,
    private creaCsvService: CreaCsvService,
    private creaBibtexService: CreaBibtexService
  ) { }

  ngOnInit(): void {
    this.idUserStorage = localStorage.getItem("id_user");

  }


  generaTxtArticulos(){
    this.valorDocumento = true;

    this.creatxtService.generaTxtArticulos(this.idUserStorage).subscribe((data) => {
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
    this.creatxtService.generaTxtLibros(this.idUserStorage).subscribe((data) => {
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
    this.creatxtService.generaTxtProyectos(this.idUserStorage).subscribe((data) => {
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
    this.creatxtService.generaTxtCapacitacion(this.idUserStorage).subscribe((data) => {
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
    this.creatxtService.generaTxtGradoAcademico(this.idUserStorage).subscribe((data) => {
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

  generaCsvArticulos(){
    this.valorDocumento = true;
    this.creaCsvService.generaCsvArticulos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "articulos_informacion_csv.csv";
      link.click();
      this.valorDocumento = false;

    });
  }

  generaCsvLibros(){
    this.valorDocumento = true;
    this.creaCsvService.generaCsvLibros(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "libros_informacion_csv.csv";
      link.click();
      this.valorDocumento = false;

    });
  }

  generaCsvProyectos(){
    this.valorDocumento = true;
    this.creaCsvService.generaCsvProyectos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "proyectos_informacion_csv.csv";
      link.click();
      this.valorDocumento = false;

    });
  }

  generaCsvCapacitacion(){
    this.valorDocumento = true;
    this.creaCsvService.generaCsvCapacitacion(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "capacitaciones_informacion_csv.csv";
      link.click();
      this.valorDocumento = false;

    });
  }

  generaCsvGradoAcademico(){
    this.valorDocumento = true;
    this.creaCsvService.generaCsvGradoAcademico(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "gradoAcademico_informacion_csv.csv";
      link.click();
      this.valorDocumento = false;

    });
  }



  generaBibArticulos(){
    this.valorDocumento = true;
    this.creaBibtexService.generaBibArticulos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "articulos_informacion_bib.bib";
      link.click();
      this.valorDocumento = false;

    });
  }

  generaBibLibros(){
    this.valorDocumento = true;
    this.creaBibtexService.generaBibArticulos(this.idUserStorage).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'text/plain'});
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "articulos_informacion_bib.bib";
      link.click();
      this.valorDocumento = false;

    });
  }

  generaBibProyectos(){

  }

  generaBibCapacitacion(){

  }
  
  generaBibGradoAcademico(){

  }

}
