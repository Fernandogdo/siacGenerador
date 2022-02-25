import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Global } from '../global/global';

@Injectable({
  providedIn: 'root'
})
export class CreaBibtexService {

  public url:string

  constructor(private http: HttpClient) { 
    this.url = Global.url;

  }

  generaInformacionBibTex(bloque, id_user){
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'informacion_bibtex/' + bloque + '/' + id_user, httpOptions);
  }

}
