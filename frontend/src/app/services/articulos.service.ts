
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  URL_ARTICULOS = 'https://sica.utpl.edu.ec/ws/api/articulos/'


  constructor(
    private http: HttpClient
  ) {
   
  }

  

  getArticulos() {
    return this.http.get(this.URL_ARTICULOS);
  }
}