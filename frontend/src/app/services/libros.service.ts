import {  Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  URL_LIBROS = 'https://sica.utpl.edu.ec/ws/api/libros-autores/'

  constructor(
    private http: HttpClient
  ) { }


  getLibros () {
    return this.http.get(this.URL_LIBROS);
   
  }
}
