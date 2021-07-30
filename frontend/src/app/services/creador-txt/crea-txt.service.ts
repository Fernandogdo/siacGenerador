import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CreaTxtService {

  URL_TXT_ARTICULOS = 'http://localhost:8000/api/informacion_txt_articulos/';
  URL_TXT_LIBROS = 'http://localhost:8000/api/informacion_txt_libros/'
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

}
