import { Observable } from "rxjs/Observable";
import { Configuracioncv } from "./../models/configuracioncv.model";
import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { post } from "jquery";
import { Bloque } from "../models/bloque.model";
import { ConfiguracioncvPersonalizado } from "../models/configuracioncvPersonalizado.model";
import { BehaviorSubject } from "rxjs";
import { AuthorizationService } from "./login/authorization.service";
import { servicioBloques } from "../models/servicioBloque.model";


@Injectable({
  providedIn: "root",
})
export class ConfiguracioncvService {
  URL_CONF = "http://localhost:8000/api/configuracioncv/";

  URL_BLOQUES = "http://localhost:8000/api/bloque/";

  URL_PERS = "http://localhost:8000/api/configuracioncv_personalizado/";
  
  URL_PERS_DOCENTE = 'http://localhost:8000/api/personalizacion_usuario/';

  URL_PERS_DOCENTE_BLOQUE = 'http://localhost:8000/api/personalizados/';

  URL_ELIMINA_PERSO = 'http://localhost:8000/api/elimina-personalizados/';

  URL_ESQUEMA = 'https://sica.utpl.edu.ec/ws/schema?format=openapi-json';

  URL_SERVICIOS = 'http://localhost:8000/api/servicio/'


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
  // selectedConfiguracion: Configuracioncv = {
  //   usuario: 1,
  //   bloque: "",
  //   atributo: "",
  //   ordenCompleto: 1,
  //   ordenResumido: 2,
  //   mapeo: "",
  //   visible_cv_completo: true,
  //   visible_cv_resumido: true,
  // };

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
    
    // this.getJSON().subscribe((data) => {
    //   console.log("DATASERVICE", data.components.schemas);
    // });

    //POST BLOQUES Y CONFIGURACIÓN
    // this.recorreConfiguracion()
    // this.recorreBloques()
  }

  // Lee esquema Json
  // public getJSON(): Observable<any> {
  //   // return this.http.get(this.URL_ESQUEMA);
  //   return this.http.get("../../assets/esquema/esquemasiac.json");

  // }


  // Configuraciones Generales
  getConfiguraciones() {
    return this.http.get<Configuracioncv[]>(this.URL_CONF);
  }

  postConfiguraciones(bloque, atributo) {
    const path = `${this.URL_CONF}`;

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


  // Copia esquema de Json SIAC 
  // copiaEsquema() {
  //   this.getJSON().subscribe((data) => {
  //     let lala = Object.keys(data.components.schemas);
  //     let keys = Object.keys(lala);
  //     console.log("ESQUEMAS", keys);

  //     const arreglo = []
  //     for (let i = 0; i < keys.length; i++) {
  //       let clave = keys[i];
  //       let acceso = lala[clave];
  //       console.log("ACCESO", acceso);
  //       let atributos_todos = Object.keys(
  //         data.components.schemas[acceso].properties
  //       );
  //       let keys_atributos_todos = Object.keys(atributos_todos);
  //       console.log("🚀 ~ file: configuracioncv.service.ts ~ line 166 ~ ConfiguracioncvService ~ this.getJSON ~ keys_atributos_todos", keys_atributos_todos)
        
       
  //       for (let index = 0; index < keys_atributos_todos.length; index++) {
  //         const clave_atributo = keys_atributos_todos[index];
  //         console.log('ATRIBUTOS', atributos_todos[clave_atributo])
  //         this.atrbutoEsquema = atributos_todos[clave_atributo]
        
  //         const datos = {
  //           bloque: acceso,
  //           atributo: this.atrbutoEsquema
  //         }
  //         this.arregloEsquema.push(datos)
  //         // console.log("ARREGLOESQUEMA", this.arregloEsquema)

  //       }       
  //     }
  //     console.log("ARREGLOESQUEMA", this.arregloEsquema)

  //     // this.comparaEsquemaBaseDatos(this.arregloEsquema)
  //     this.arregloEsquema = []
  //   });
  // }
  

  putConfiguracion(configuracion: Configuracioncv) {
    console.log("SEDEBERIAEDITAR")
    return this.http.put(this.URL_CONF + configuracion.id + "/", configuracion);
  }
  // putServicios(servicio: servicioBloques) {
  //   return this.http.put(this.URL_SERVICIOS + servicio.id + "/", servicio);
  // }

  deleteConfiguracion(id: string) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.delete(this.URL_CONF + id);
  }


  // Configuracion Personalizada
  getConfiguracionesPersonalizadas() {
    return this.http.get<ConfiguracioncvPersonalizado[]>(this.URL_PERS);
  }

  postConfiguracionPersonalizada(configuracionPersonalizada) {
    const path = `${this.URL_PERS}`;
    return this.http.post<ConfiguracioncvPersonalizado>(
      path,
      configuracionPersonalizada
    );
  }

  deleteConfiguracionPersonalizada(id){
    return this.http.delete(this.URL_PERS + id)
  }

  deleteConfiguracionesPersonalizadas(nombre_cv, cvHash){
    return this.http.get(this.URL_ELIMINA_PERSO + nombre_cv + "/" + cvHash)
  }

  putConfiguracionPersonalizada(configuracionPersonalizada: ConfiguracioncvPersonalizado) {
    console.log("configuracionPersonalizada", configuracionPersonalizada)
    return this.http.put(this.URL_PERS + configuracionPersonalizada.id + "/",configuracionPersonalizada);
  }

  listaConfiguracionPersonalizadaDocente(idUsuario){
    return this.http.get<ConfiguracioncvPersonalizado[]>(this.URL_PERS_DOCENTE + idUsuario)
  }

  /* Bloque */
  getBloques() {
    return this.http.get<Bloque[]>(this.URL_BLOQUES);
  }


  // Post de los Bloques
  postBloques(bloques) {
    const path = `${this.URL_BLOQUES}`;

    return this.http.post<Bloque>(path, {
      nombre: bloques,
    });
  }


  // // Entra a esquema, recorre bloques y hace post
  // recorreBloques() {
  //   this.getJSON().subscribe((data) => {
  //     // this.datos= data.components.
  //     let lala = Object.keys(data.components.schemas);
  //     let array = Object.assign({}, lala);
  //     console.log(array);

  //     // let claves = Object.keys(lala);

  //     this.esquemas = Object.entries(data.components.schemas);
    
  //     // this.claves = Object.keys(lala);
  //     let keys = Object.keys(lala);
  //     console.log("claves", keys);

  //     for (let i = 0; i < keys.length; i++) {
  //       let clave = keys[i];
  //       // let myjson = JSON.stringify()
  //       this.postBloques(lala[clave]).subscribe((res) => {
  //         console.log("DATA", res);
  //       });
  //       console.log("DATA", lala[clave]);
  //     }
  //   });
  // }

  putBloque(bloque: Bloque) {
    return this.http.put(this.URL_BLOQUES + bloque.id + "/", bloque);
  }

  public createConfigracioncv(configuracioncv: Configuracioncv): Observable<Configuracioncv> {
    return this.http.post<Configuracioncv>(this.URL_CONF, configuracioncv);
  }  


  // getServicios() {
  //   return this.http.get<servicioBloques[]>(this.URL_SERVICIOS);
  // }


  // postServicios(servicio){
  //   return this.http.post<servicioBloques>(this.URL_SERVICIOS, servicio);
  // }

  // putServicios(servicio: servicioBloques) {
  //   return this.http.put(this.URL_SERVICIOS + servicio.id + "/", servicio);
  // }
  
}
