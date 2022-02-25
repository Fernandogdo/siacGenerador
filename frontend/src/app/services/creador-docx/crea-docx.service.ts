import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from '../global/global';

@Injectable({
  providedIn: 'root'
})
export class CreaDocxService {

  public url:string;

  constructor(private http: HttpClient) { 
    this.url = Global.url;
  }

  // Servicio para generar DOCX Completo
  generaDocCompleto(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'doc-completo/' + id_user, httpOptions);
  }

  // Servicio para generar DOCX Resumido
  generaDocResumido(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'doc-resumido/' + id_user, httpOptions);
  }

  // Servicio para generar DOCX Personalizado
  generaDocPersonalizado(id_user, nombre_cv, cv){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'doc-personalizado/' + id_user + "/" + nombre_cv + "/" + cv, httpOptions)
  }

}
