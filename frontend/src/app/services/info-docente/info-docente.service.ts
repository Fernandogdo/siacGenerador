import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';import { Router } from '@angular/router';
import { Docente } from 'app/models/docente';


@Injectable({
  providedIn: 'root'
})
export class InfoDocenteService {


  URL_DOCENTE = 'https://sica.utpl.edu.ec/ws/api/docentes/'
  URL_ARTICULOS = 'https://sica.utpl.edu.ec/ws/api/articulos/'
  

  constructor(
    private http: HttpClient
  ) { 

    this.getInfoDocente()
  }



  getInfoDocente(){
    let token = '54fc0dc20849860f256622e78f6868d7a04fbd30'
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':'token ' + token,
    });

    return this.http.get(this.URL_DOCENTE + 19 + '/', {headers:headers})
  }
}
