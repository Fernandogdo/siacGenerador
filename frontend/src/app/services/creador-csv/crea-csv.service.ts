import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Global } from '../global/global';


@Injectable({
  providedIn: 'root'
})
export class CreaCsvService {

  public url:string

  constructor(private http: HttpClient) { 
    this.url = Global.url;

  }

  // Servicio para generar CSV
  generaCsvInformacion(bloque, id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_csv/' + bloque + '/' + id_user, httpOptions);
  }

}
