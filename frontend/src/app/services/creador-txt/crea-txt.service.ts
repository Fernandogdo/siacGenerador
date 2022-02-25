import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from '../global/global';


@Injectable({
  providedIn: 'root'
})
export class CreaTxtService {

  public url: string

  constructor(private http: HttpClient) {
    this.url = Global.url;

  }

  txtInformacion(bloque, id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'txt-informacion/' +  bloque + '/' + id_user, httpOptions);
  }

}
