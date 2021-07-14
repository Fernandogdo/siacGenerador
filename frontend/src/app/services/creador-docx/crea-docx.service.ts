import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CreaDocxService {

  URL_DOC_COMPLETO = 'http://localhost:8000/api/doc-completo/';
  URL_DOC_RESUMIDO = 'http://localhost:8000/api/doc-resumido/';

  constructor(private http: HttpClient) { }



  generaDocCompleto(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_DOC_COMPLETO + id_user, httpOptions);
  }
}
