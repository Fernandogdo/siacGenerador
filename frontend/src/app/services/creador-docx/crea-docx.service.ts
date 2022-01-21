import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from '../global/global';

@Injectable({
  providedIn: 'root'
})
export class CreaDocxService {

  public url:string;

  // URL_DOC_COMPLETO = 'http://localhost:8000/api/doc-completo/';
  // URL_DOC_RESUMIDO = 'http://localhost:8000/api/doc-resumido/';
  // URL_DOC_PERSONALIZA = 'http://localhost:8000/api/doc-personalizado/';
  constructor(private http: HttpClient) { 
    this.url = Global.url;

  }



  generaDocCompleto(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'doc-completo/' + id_user, httpOptions);
  }

  generaDocResumido(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'doc-resumido/' + id_user, httpOptions);
  }

  generaDocPersonalizado(id_user, nombre_cv, cv){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'doc-personalizado/' + id_user + "/" + nombre_cv + "/" + cv, httpOptions)
  }

}
