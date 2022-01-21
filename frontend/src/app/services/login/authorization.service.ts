import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';import { Router } from '@angular/router';
import { Docente } from 'app/models/docente';
import { BehaviorSubject } from 'rxjs';
import { Global } from '../global/global';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  public url: string;

  authenticationState = new BehaviorSubject(false);

  idUser;
  idUserStorage;
  usuario;
  rolUsuario;

  // URL_LOGIN = 'http://localhost:8000/api/login/'
  // URL_DOCENTE = 'http://localhost:8000/api/usuario/'; 
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'

    })
  }
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { 
    this.url = Global.url;

  }

  consultarUsuarioIngreso(usuario: Docente) {
    this.http.post<Docente>(this.url + 'login/', usuario, this.httpOptions).subscribe( res => {
      this.iniciarSesionDocente(res);
      this.usuario = res;
      this.rolUsuario = this.usuario.username.is_staff
      localStorage.setItem('is_staff', this.rolUsuario)

      console.log("STAFF",this.usuario.username.is_staff)
      // this.presentToast()
      // console.log("SR ICE", res.token)
      // this.idUser = res.id_user
      // console.log("ROLUSUARIO", res.username)
      let rol =localStorage.getItem('is_staff')

      let rolUsuario = (rol === 'true');
      console.log("ROLUSUARIOASDSA", rolUsuario)

      if (rolUsuario) {
        console.log("ESADMIN")
        this.router.navigate(['/administrador']);

        this._snackBar.open('Ha iniciado Sesion', "Cerrar", {
          duration: 2000,
        });
      } 
      else {
        console.log("noESADMIN")
        this.router.navigate(['/dashboard']);
        this._snackBar.open('Ha iniciado Sesion', "Cerrar", {
          duration: 2000,
          
        });
        
      }
    
      // this._snackBar.open('Ha iniciado Sesion', "Cerrar", {
      //   duration: 2000,
      // });
      // this.router.navigate(['/dashboard']);
      
    }, error => {
      console.log("ERROR AL LOGUEAR")
      this.errorLogueo();
    });
  }

  comprobarId(idParamsUrl){
    console.log("IDUSERGUARDADO", idParamsUrl, localStorage.getItem("id_user"))
    this.idUserStorage = localStorage.getItem("id_user");
    if ( !idParamsUrl) {
      console.log("NOSONIGUALES", this.idUserStorage, this.idUser)
      this.cerrarSesionDocente();
    } else{
      console.log("SONIGUALES")
    }
  }

  privilegios(){
    let rol = localStorage.getItem('is_staff');
    console.log("🚀 ~ file: authorization.service.ts ~ line 39 ~ AuthorizationService ~ privilegios ~ rol", rol) 
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  obtenerIdDocente() {
    return this.idUser
  }

  ObtenerRol() {
    return localStorage.getItem('is_staff');
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
    localStorage.setItem('is_staff', usuario.username.is_staff);
  }

  // enviarIdUsuario(idDocente){
  //   localStorage.setItem('idDocente', idDocente)
  // }

  obtenerIdUsuario(){
    return localStorage.getItem('idDocente')
  }

  cerrarSesionDocente() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getOneUser(id: string) {
    return this.http.get(this.url + 'usuario/' + `${id}`);
  }


  isAuthenticated(){
    return this.authenticationState.value;
  }
  

  async errorLogueo() {
    console.log("🚀 ~ file: authorization.service.ts ~ line 56 ~ AuthorizationService ~ errorLogueo ~ l")
    this._snackBar.open('Usuario o Contrasena Incorrectos', "Cerrar", {
      duration: 2000,
    });
    this.router.navigate(['/login']);
  }
}

