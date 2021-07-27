import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CreaTxtService {

  URL_TXT = 'http://localhost:8000/api/informacion_txt/';

  constructor(private http: HttpClient) { }



  generaTxt(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_TXT + id_user, httpOptions);
  }

}
