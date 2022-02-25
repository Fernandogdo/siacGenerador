// import { Observable } from "rxjs/Observable";
import { Configuracioncv } from "./../models/configuracioncv.model";
import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { post } from "jquery";
import { Bloque } from "../models/bloque.model";
import { ConfiguracioncvPersonalizado } from "../models/configuracioncvPersonalizado.model";
import { BehaviorSubject } from "rxjs";
// import { AuthorizationService } from "./login/authorization.service";
import { servicioBloques } from "../models/servicioBloque.model";
import { Global } from "./global/global";


@Injectable({
  providedIn: "root",
})
export class ConfiguracioncvService {

  public url:string;

  // URL_CONF = "http://localhost:8000/api/configuracioncv/";

  // URL_BLOQUES = "http://localhost:8000/api/bloque/";

  // URL_PERS = "http://localhost:8000/api/configuracioncv_personalizado/";
  
  // URL_PERS_DOCENTE = 'http://localhost:8000/api/personalizacion_usuario/';

  // URL_PERS_DOCENTE_BLOQUE = 'http://localhost:8000/api/personalizados/';

  // URL_ELIMINA_PERSO = 'http://localhost:8000/api/elimina-personalizados/';

  // URL_ESQUEMA = 'https://sica.utpl.edu.ec/ws/schema?format=openapi-json';

  // URL_SERVICIOS = 'http://localhost:8000/api/servicio/'


  claves: any = [];
  esquemas: any = [];
  arregloEsquema: any = []
  arregloBloquesEsquema: any = [];
  atrbutoEsquema;
  arregloBaseDatos;
  arregloBaseDatosBloques;
  nosimilitud: any = [];
  similitud: any = [];
  nosimilitudBloques: any = [];
  similitudBloques: any = [];


  selectedServicio: servicioBloques = {
    bloqueNombre: '',
    url: '' 
  };

  configuraciones: Configuracioncv[];
  configuracionesPersonalizadas: ConfiguracioncvPersonalizado[];
  bloques: Bloque[];
  onConfiguracionesChanged: BehaviorSubject<any>;
  onConfigPersonalizadasChanged: BehaviorSubject<any>;

  constructor(
    private http: HttpClient,
    ) {
    this.onConfiguracionesChanged = new BehaviorSubject([]);
    this.onConfigPersonalizadasChanged = new BehaviorSubject([]);

    this.url = Global.url;

  }

  // Configuraciones Generales
  getConfiguraciones() {
    return this.http.get<Configuracioncv[]>(this.url + 'configuracioncv/');
  }

  postConfiguraciones(bloque, atributo) {
    const path = `${this.url + 'configuracioncv/'}`;

    return this.http.post<Configuracioncv>(path, {
      bloque: bloque,
      atributo: atributo,
      orden: 1,
      visible_cv_resumido: true,
      visible_cv_completo: true,
      mapeo: atributo,
      usuario: 1,
    });
  }
  

  putConfiguracion(configuracion: Configuracioncv) {
    console.log("SEDEBERIAEDITAR")
    return this.http.put(this.url + 'configuracioncv/' + configuracion.id + "/", configuracion);
  }
  

  deleteConfiguracion(id: string) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.delete(this.url + 'configuracioncv/' + id);
  }


  // Configuracion Personalizada
  getConfiguracionesPersonalizadas() {
    return this.http.get<ConfiguracioncvPersonalizado[]>(this.url + 'configuracioncv_personalizado/');
  }

  postConfiguracionPersonalizada(configuracionPersonalizada) {
    const path = `${this.url + 'configuracioncv_personalizado/'}`;
    return this.http.post<ConfiguracioncvPersonalizado>(
      path,
      configuracionPersonalizada
    );
  }

  deleteConfiguracionPersonalizada(id){
    return this.http.delete(this.url + 'configuracioncv_personalizado/' + id)
  }

  deleteConfiguracionesPersonalizadas(nombre_cv, cvHash){
    return this.http.get(this.url + 'elimina-personalizados/' + nombre_cv + "/" + cvHash)
  }

  putConfiguracionPersonalizada(configuracionPersonalizada: ConfiguracioncvPersonalizado) {
    // console.log("configuracionPersonalizada", configuracionPersonalizada)
    return this.http.put(this.url + 'configuracioncv_personalizado/' + configuracionPersonalizada.id + "/",configuracionPersonalizada);
  }

  listaConfiguracionPersonalizadaDocente(idUsuario){
    return this.http.get<ConfiguracioncvPersonalizado[]>(this.url + 'personalizacion_usuario/' + idUsuario)
  }

  /* Bloque */
  getBloques() {
    return this.http.get<Bloque[]>(this.url + 'bloque/');
  }


  // Post de los Bloques
  postBloques(bloques) {
    const path = `${this.url + 'bloque/'}`;

    return this.http.post<Bloque>(path, {
      nombre: bloques,
    });
  }


  putBloque(bloque: Bloque) {
    return this.http.put(this.url + 'bloque/' + bloque.id + "/", bloque);
  }


  
}
