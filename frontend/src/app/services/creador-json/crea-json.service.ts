import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from '../global/global';


@Injectable({
  providedIn: 'root'
})
export class CreaJsonService {

  public url:string;

  // URL_JSON_COMPLETO = 'http://localhost:8000/api/json-completo/';
  // URL_JSON_RESUMIDO = 'http://localhost:8000/api/json-resumido/';
  // URL_JSON_PERSONALIZADO = 'http://localhost:8000/api/json-personalizado/';

  constructor(private http: HttpClient) { 
    this.url = Global.url;

  }

  generaJsonCompleto(id_user) {
    console.log('JSONCPMPLETO', this.url + 'json-completo/' + id_user)
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'json-completo/' + id_user, httpOptions);
  }
  
  generaJsonResumido(id_user) {
    console.log('JSONRESUMIDO', this.url + 'json-resumido/' + id_user)

    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'json-resumido/' + id_user, httpOptions);
  }


  generaJsonPersonalizado(id_user, nombre_cv, cv){
    console.log('JSONPERSONALIZADO', this.url + 'json-personalizado/' + id_user + "/" + nombre_cv + "/" + cv)

    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'json-personalizado/' + id_user + "/" + nombre_cv + "/" + cv,  httpOptions);
  }



}
