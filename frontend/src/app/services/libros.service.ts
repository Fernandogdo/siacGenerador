import {  Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InfoDocenteService } from './info-docente/info-docente.service';


@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  // URL_LIBROS = 'https://sica.utpl.edu.ec/ws/api/libros-autores/';
  URL_DOCENTE = 'https://sica.utpl.edu.ec/ws/api/docentes/'
  URL_LIBROS = 'https://sica.utpl.edu.ec/ws/api/libros/';
  data;

  constructor(
    private http: HttpClient,
    private infoDocenteService: InfoDocenteService
  ) { 
    // this.getLibros()

  }

  // getInfoDocente(id_User): Observable<Usuario[]>{
  //   let token = '54fc0dc20849860f256622e78f6868d7a04fbd30'
  //   const headers = new HttpHeaders({
  //     'Content-Type':'application/json',
  //     'Authorization':'token ' + token,
  //   });

  //   return this.http.get<Usuario[]>(this.URL_DOCENTE + id_User + '/', {headers:headers})
  // }


  getDocente(id_User){
    let token = '54fc0dc20849860f256622e78f6868d7a04fbd30'
    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':'token ' + token,
    });
    return this.http.get(this.URL_DOCENTE + id_User + '/' , {headers:headers})
      // .subscribe(res =>{
      //   this.data = res;
      //   console.log(this.data['related'])
      // });
    
  }

  getLibros () {
    console.log('asdsadsadDATA->>>>>>>>>>..', this.data)
    let token = '54fc0dc20849860f256622e78f6868d7a04fbd30'

    const headers = new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization':'token ' + token,
    });
    
    return this.http.get(this.URL_LIBROS + 4321 + '/', {headers:headers});
   
  }
}
