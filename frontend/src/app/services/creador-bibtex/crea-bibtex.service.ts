import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreaBibtexService {

  URL_BIB_ARTICULOS = 'http://localhost:8000/api/informacion_bib_articulos/';
  URL_BIB_LIBROS = 'http://localhost:8000/api/informacion_bib_libros/';
  URL_BIB_PROYECTOS = 'http://localhost:8000/api/informacion_bib_proyectos/';
  URL_BIB_CAPACITACIONES = 'http://localhost:8000/api/informacion_bib_capacitaciones/';
  URL_BIB_GRADOACADEMICO = 'http://localhost:8000/api/informacion_bib_grado-academico/';
  URL_BIBTEXT = 'http://localhost:8000/api/crea-bibtext/';

  constructor(private http: HttpClient) { }

  generaBibArticulos(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_BIB_ARTICULOS + id_user, httpOptions);
  }

  generaBibLibros(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_BIB_LIBROS + id_user, httpOptions);
  }


  generaBibProyectos(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_BIB_PROYECTOS + id_user, httpOptions);
  }

  generaBibCapacitacion(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_BIB_CAPACITACIONES + id_user, httpOptions);
  }

  

  generaBibGradoAcademico(id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_BIB_GRADOACADEMICO + id_user, httpOptions);
  }

  generaBibtex(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_BIBTEXT + id_user, httpOptions);
  }
}
