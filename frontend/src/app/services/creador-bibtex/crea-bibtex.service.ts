import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Global } from '../global/global';

@Injectable({
  providedIn: 'root'
})
export class CreaBibtexService {

  public url:string

  // URL_BIB_ARTICULOS = 'http://localhost:8000/api/informacion_bib_articulos/';
  // URL_BIB_LIBROS = 'http://localhost:8000/api/informacion_bib_libros/';
  // URL_BIB_PROYECTOS = 'http://localhost:8000/api/informacion_bib_proyectos/';
  // URL_BIB_CAPACITACIONES = 'http://localhost:8000/api/informacion_bib_capacitaciones/';
  // URL_BIB_GRADOACADEMICO = 'http://localhost:8000/api/informacion_bib_grado-academico/';
  // URL_BIBTEXT = 'http://localhost:8000/api/crea-bibtext/';

  constructor(private http: HttpClient) { 
    this.url = Global.url;

  }

  generaBibArticulos(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_bib_articulos/' + id_user, httpOptions);
  }

  generaBibLibros(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_bib_libros/' + id_user, httpOptions);
  }


  generaBibProyectos(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_bib_proyectos/' + id_user, httpOptions);
  }

  generaBibCapacitacion(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_bib_capacitaciones/' + id_user, httpOptions);
  }

  

  generaBibGradoAcademico(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_bib_grado-academico/' + id_user, httpOptions);
  }

  generaBibtex(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'crea-bibtext/' + id_user, httpOptions);
  }
}
