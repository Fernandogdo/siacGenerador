
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  URL_PROYECTOS = 'https://sica.utpl.edu.ec/ws/api/proyectos/';
  constructor(
    private http: HttpClient
  ) { }


  getProyectos(){
    return this.http.get(this.URL_PROYECTOS);
  }
}
