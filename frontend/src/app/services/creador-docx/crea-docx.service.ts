import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CreaDocxService {

  URL_DOC_COMPLETO = 'http://localhost:8000/api/doc-completo/';
  URL_DOC_RESUMIDO = 'http://localhost:8000/api/doc-resumido/';
  URL_DOC_PERSONALIZA = 'http://localhost:8000/api/doc-personalizado/';
  constructor(private http: HttpClient) { }



  generaDocCompleto(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_DOC_COMPLETO + id_user, httpOptions);
  }

  generaDocResumido(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_DOC_RESUMIDO + id_user, httpOptions);
  }

  generaDocPersonalizado(id_user, nombre_cv, cv){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_DOC_PERSONALIZA + id_user + "/" + nombre_cv + "/" + cv, httpOptions)
  }

  // generaPdfPersonalizado(id_user, nombre_cv) {
  //   const httpOptions = {
  //     responseType: 'blob' as 'json',
  //   };
  //   return this.http.get(this.URL_PDF_PERSONALIZADO + id_user + "/" + nombre_cv,  httpOptions);
  // }
}
