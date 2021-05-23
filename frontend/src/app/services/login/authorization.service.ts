import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Docente } from 'app/models/docente';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {


  URL_LOGIN = 'http://127.0.0.1:8000/api/login/'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'

    })
  }
  
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  consultarUsuarioIngreso(usuario: Docente) {
    this.http.post<Docente>(this.URL_LOGIN, usuario, this.httpOptions).subscribe( res => {
      this.iniciarSesionDocente(res);
      // this.presentToast()
      this.router.navigate(['/dashboard']);
      
    }, error => {
      this.errorLogueo();
    });
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  obtenerIdDocente() {
    return localStorage.getItem('id_user');
  }

  obtenerNombresDocente() {
    return localStorage.getItem('username');
  }

  ObtenerApellidosDocente() {
    return localStorage.getItem('last_name');
  }

  ObtenerNombresDocente() {
    return localStorage.getItem('first_name');
  }

   //Envia datos de usuario al storage 
   iniciarSesionDocente(usuario) {
    localStorage.setItem('token', usuario.token);
    localStorage.setItem('id_user', usuario.username.id_user);
    localStorage.setItem('username', usuario.username.username);
    localStorage.setItem('first_name', usuario.username.first_name);
    localStorage.setItem('last_name', usuario.username.first_name);
  }

  cerrarSesionDocente() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  async errorLogueo() {
    console.log("🚀 ~ file: authorization.service.ts ~ line 56 ~ AuthorizationService ~ errorLogueo ~ l")
  }
}

