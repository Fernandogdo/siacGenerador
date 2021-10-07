import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CreaCsvService {

  URL_CSV = 'http://localhost:8000/api/informacion_csv/';
  // URL_DOC_RESUMIDO = 'http://localhost:8000/api/doc-resumido/';

  constructor(private http: HttpClient) { }


  generaCsv(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_CSV + id_user, httpOptions);
  }
}
