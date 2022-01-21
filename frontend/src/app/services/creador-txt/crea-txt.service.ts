import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from '../global/global';


@Injectable({
  providedIn: 'root'
})
export class CreaTxtService {

  public url: string

  // URL_TXT_ARTICULOS = 'http://localhost:8000/api/informacion_txt_articulos/';
  // URL_TXT_LIBROS = 'http://localhost:8000/api/informacion_txt_libros/';
  // URL_TXT_PROYECTOS = 'http://localhost:8000/api/informacion_txt_proyectos/';
  // URL_TXT_CAPACITACIONES = 'http://localhost:8000/api/informacion_txt_capacitaciones/';
  // URL_TXT_GRADOACADEMICO = 'http://localhost:8000/api/informacion_txt_gradoacademico/';
  // URL_TXT_INFORMACION = 'http://localhost:8000/api/txt-informacion/'

  constructor(private http: HttpClient) { 
    this.url = Global.url;

  }



  generaTxtArticulos(id_user) {
    console.log("URLARTICULOS", this.url + 'informacion_txt_articulos/' + id_user)
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_txt_articulos/' + id_user, httpOptions);
  }

  generaTxtLibros(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_txt_libros/' + id_user, httpOptions);
  }


  generaTxtProyectos(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_txt_proyectos/' + id_user, httpOptions);
  }

  generaTxtCapacitacion(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_txt_capacitaciones/' + id_user, httpOptions);
  }

  

  generaTxtGradoAcademico(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_txt_gradoacademico/' + id_user, httpOptions);
  }

  generaTxtInformacion(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'txt-informacion/' + id_user, httpOptions);
  }

}
