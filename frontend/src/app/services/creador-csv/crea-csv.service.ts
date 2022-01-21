import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from '../global/global';


@Injectable({
  providedIn: 'root'
})
export class CreaCsvService {

  public url:string

  // URL_CSV_ARTICULOS = 'http://localhost:8000/api/informacion_csv_articulos/';
  // URL_CSV_LIBROS = 'http://localhost:8000/api/informacion_csv_libros/';
  // URL_CSV_PROYECTOS = 'http://localhost:8000/api/informacion_csv_proyectos/';
  // URL_CSV_CAPACITACIONES = 'http://localhost:8000/api/informacion_csv_capacitaciones/';
  // URL_CSV_GRADOACADEMICO = 'http://localhost:8000/api/informacion_csv_grado-academico/';
  // URL_CSV = 'http://localhost:8000/api/informacion_csv/';
  // URL_DOC_RESUMIDO = 'http://localhost:8000/api/doc-resumido/';

  constructor(private http: HttpClient) { 
    this.url = Global.url;

  }


  generaCsvArticulos(id_user) {
    console.log("URLCSVARTICULOS", this.url + 'informacion_csv_articulos/' + id_user)
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_csv_articulos/' + id_user, httpOptions);
  }

  generaCsvLibros(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_csv_libros/' + id_user, httpOptions);
  }


  generaCsvProyectos(id_user) {
    console.log("URLCSVPROYECTOS", this.url + 'informacion_csv_proyectos/' + id_user)
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_csv_proyectos/' + id_user, httpOptions);
  }

  generaCsvCapacitacion(id_user){
    console.log("URLCSVCAPACITA", this.url + 'informacion_csv_capacitaciones/' + id_user)
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_csv_capacitaciones/' + id_user, httpOptions);
  }

  

  generaCsvGradoAcademico(id_user){
    console.log("URLCVSGRADOACADEMIC", this.url + 'informacion_csv_capacitaciones/' + id_user)
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_csv_capacitaciones/' + id_user, httpOptions);
  }

  generaCsv(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_csv/' + id_user, httpOptions);
  }
}
