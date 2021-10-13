import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CreaJsonService {

  URL_JSON_COMPLETO = 'http://localhost:8000/api/json-completo/';
  URL_JSON_RESUMIDO = 'http://localhost:8000/api/json-resumido/';
  URL_JSON_PERSONALIZADO = 'http://localhost:8000/api/json-personalizado/';

  constructor(private http: HttpClient) { }

  generaJsonCompleto(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_JSON_COMPLETO + id_user, httpOptions);
  }
  
  generaJsonResumido(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_JSON_RESUMIDO + id_user, httpOptions);
  }


  generaJsonPersonalizado(id_user, nombre_cv){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_JSON_PERSONALIZADO + id_user + "/" + nombre_cv,  httpOptions);
  }



}
