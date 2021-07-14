
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  URL_ARTICULOS = 'https://sica.utpl.edu.ec/ws/api/articulos/'


  constructor(
    private http: HttpClient
  ) {
   
  }

  // generaDocCompleto(id_user) {
  //   const httpOptions = {
  //     responseType: 'blob' as 'json',
  //   };
  //   return this.http.get(this.URL_DOC_COMPLETO + id_user, httpOptions);
  // }

  getArticulos(idArticulo) {
    let token = '54fc0dc20849860f256622e78f6868d7a04fbd30'

    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':'token ' + token,
      // 'responseType': 'blob' as 'json'
    });
    return this.http.get(this.URL_ARTICULOS + idArticulo + '/', {headers:headers});
  }
}