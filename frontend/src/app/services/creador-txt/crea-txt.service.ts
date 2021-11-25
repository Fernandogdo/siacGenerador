import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CreaTxtService {

  URL_TXT_ARTICULOS = 'http://localhost:8000/api/informacion_txt_articulos/';
  URL_TXT_LIBROS = 'http://localhost:8000/api/informacion_txt_libros/';
  URL_TXT_PROYECTOS = 'http://localhost:8000/api/informacion_txt_proyectos/';
  URL_TXT_CAPACITACIONES = 'localhost:8000/api/informacion_txt_capacitaciones/';
  URL_TXT_GRADOACADEMICO = 'localhost:8000/api/informacion_txt_gradoacademico/';
  URL_TXT_INFORMACION = 'http://localhost:8000/api/txt-informacion/'

  constructor(private http: HttpClient) { }



  generaTxtArticulos(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_TXT_ARTICULOS + id_user, httpOptions);
  }

  generaTxtLibros(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_TXT_LIBROS + id_user, httpOptions);
  }


  generaTxtProyectos(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_TXT_PROYECTOS + id_user, httpOptions);
  }

  generaTxtCapacitacion(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_TXT_CAPACITACIONES + id_user, httpOptions);
  }

  

  generaTxtGradoAcademico(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_TXT_GRADOACADEMICO + id_user, httpOptions);
  }

  generaTxtInformacion(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_TXT_INFORMACION + id_user, httpOptions);
  }

}
