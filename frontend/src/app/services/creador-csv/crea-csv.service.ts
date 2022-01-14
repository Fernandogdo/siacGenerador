import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CreaCsvService {

  URL_CSV_ARTICULOS = 'http://localhost:8000/api/informacion_csv_articulos/';
  URL_CSV_LIBROS = 'http://localhost:8000/api/informacion_csv_libros/';
  URL_CSV_PROYECTOS = 'http://localhost:8000/api/informacion_csv_proyectos/';
  URL_CSV_CAPACITACIONES = 'http://localhost:8000/api/informacion_csv_capacitaciones/';
  URL_CSV_GRADOACADEMICO = 'http://localhost:8000/api/informacion_csv_grado-academico/';
  URL_CSV = 'http://localhost:8000/api/informacion_csv/';
  // URL_DOC_RESUMIDO = 'http://localhost:8000/api/doc-resumido/';

  constructor(private http: HttpClient) { }


  generaCsvArticulos(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_CSV_ARTICULOS + id_user, httpOptions);
  }

  generaCsvLibros(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_CSV_LIBROS + id_user, httpOptions);
  }


  generaCsvProyectos(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_CSV_PROYECTOS + id_user, httpOptions);
  }

  generaCsvCapacitacion(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_CSV_CAPACITACIONES + id_user, httpOptions);
  }

  

  generaCsvGradoAcademico(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_CSV_GRADOACADEMICO + id_user, httpOptions);
  }

  generaCsv(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_CSV + id_user, httpOptions);
  }
}
