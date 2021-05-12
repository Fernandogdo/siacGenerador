import { Observable } from 'rxjs/Observable';
import { Configuracioncv } from './../models/configuracioncv.model';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { post } from 'jquery';
import { Bloque } from 'app/models/bloque.model';
import { ConfiguracioncvPersonalizado } from 'app/models/configuracioncvPersonalizado.model';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracioncvService {

  URL_CONF = 'http://127.0.0.1:8000/api/configuracioncv/'


  URL_BLOQUES = 'http://127.0.0.1:8000/api/bloque/';

  URL_PERS = 'http://127.0.0.1:8000/api/configuracioncv_personalizado/'

  claves: any = [];
  esquemas: any = [];


  selectedConfiguracion: Configuracioncv = {
    administrador: 1,
    bloque: '',
    atributo: '',
    orden: 0,
    mapeo: '',
    visible_cv_completo: true,
    visible_cv_resumido: true,
  };

  configuraciones: Configuracioncv[];
  configuracionesPersonalizadas: ConfiguracioncvPersonalizado[];
  bloques: Bloque[];

  constructor(
    private http: HttpClient
  ) {
    // this.test()
    this.getJSON().subscribe(data => {
      console.log('DATASERVICE', data.components.schemas);
    });

    // this.getConfiguraciones()
    // this.postBloques().subscribe(res =>{
    //   console.log('QUEQUESAD',res);
    // })
    // this.recorreConfiguracion()
    // this.recorreConfiguracionPersonalizada();
  }

  public getJSON(): Observable<any> {
    return this.http.get("../../assets/esquema/esquemasiac.json")
  }

  postBloques(bloques) {

    const path = `${this.URL_BLOQUES}`;

    return this.http.post<Bloque>(path, {
      "nombre": bloques
    });

  }

  test() {
    this.getJSON().subscribe(data => {
      // this.datos= data.components. 
      let lala = Object.keys(data.components.schemas)
      let array = Object.assign({}, lala)
      console.log(array);

      // this.postBloques(array);

      // for (let bloque of lala) {

      //   console.log('FORFOR',bloque)
      //   this.postBloques(bloque)
      //   // .subscribe(
      //   //   res => {
      //   //     console.log('FORFOR',res);
      //   //   }
      //   // )
      // }


      // array.forEach((datos) =>
      //   this.postBloques(datos[0]).subscribe(res => {
      //     console.log('GAGAGAGAG', res)
      //   }));




      let claves = Object.keys(lala);

      // console.log(claves);
      this.esquemas = Object.entries(data.components.schemas);
      // let array = Object.entries(data.components.schemas);

      // console.log(Object.entries(data.components.schemas['Articulos']['properties']));
      // console.log('DATOSDA', this.esquemas)

      // this.esquemas.forEach(element => {
      //   this.esquemas = element[0]

      // });

      this.claves = Object.keys(lala);
      let keys = Object.keys(lala)
      console.log('claves', keys)

      // this.postBloques(JSON.stringify(lala[0])).subscribe(res => {
      //   console.log('DATA', res)
      // });

      for (let i = 0; i < keys.length; i++) {
        let clave = keys[i];
        // let myjson = JSON.stringify()
        this.postBloques((lala[clave]))
          .subscribe(res => {
            console.log('DATA', res)
          });
        console.log('DATA', (lala[clave]));

      }
    });
  }

  postConfiguraciones(bloque, atributo) {
    const path = `${this.URL_CONF}`;

    return this.http.post<Configuracioncv>(path, {
      "bloque": bloque,
      "atributo": atributo,
      "orden": 1,
      "visible_cv_resumido": true,
      "visible_cv_completo": true,
      "mapeo": atributo,
      "administrador": 1
    })
  }

  recorreConfiguracion() {
    this.getJSON().subscribe(data => {
      let lala = Object.keys(data.components.schemas)
      let keys = Object.keys(lala)
      console.log('ESQUEMAS', keys)

      // let atributos = Object.keys(data.components.schemas.properties)
      // console.log(atributos)

      // let keys_atributos = Object.keys(atributos)

      for (let i = 0; i < keys.length; i++) {
        let clave = keys[i];
        let acceso = lala[clave]
        console.log('ACCESO', acceso)
        let atributos_todos = Object.keys(data.components.schemas[acceso].properties)
        let keys_atributos_todos = Object.keys(atributos_todos)

        for (let index = 0; index < keys_atributos_todos.length; index++) {
          const clave_atributo = keys_atributos_todos[index];
          // console.log('ATRIBUTOS', atributos_todos[clave_atributo])

          this.postConfiguraciones(acceso, atributos_todos[clave_atributo])
            .subscribe(res => {
              // console.log('DATA', res)
            });
          // console.log('DATA', (lala[clave]));
        }
      }
    });
  }


  postConfiguracionPersonalizada(configuracionPersonalizada) {
    const path = `${this.URL_PERS}`;
    return this.http.post<ConfiguracioncvPersonalizado>(path, configuracionPersonalizada);
  }

  // recorreConfiguracionPersonalizada(){
  //   this.getJSON().subscribe(data => {
  //     let lala = Object.keys(data.components.schemas)
  //     let keys = Object.keys(lala)
  //     console.log('ESQUEMAS', keys)

  //     // let atributos = Object.keys(data.components.schemas.properties)
  //     // console.log(atributos)

  //     // let keys_atributos = Object.keys(atributos)

  //     for (let i = 0; i < keys.length; i++) {
  //       let clave = keys[i];
  //       let acceso = lala[clave]
  //       console.log('ACCESO', acceso)
  //       let atributos_todos = Object.keys(data.components.schemas[acceso].properties)
  //       let keys_atributos_todos = Object.keys(atributos_todos)

  //       for (let index = 0; index < keys_atributos_todos.length; index++) {
  //         const clave_atributo = keys_atributos_todos[index];
  //         // console.log('ATRIBUTOS', atributos_todos[clave_atributo])

  //         this.postConfiguracionPersonalizada(acceso, atributos_todos[clave_atributo])
  //           .subscribe(res => {
  //             console.log('DATA', res)
  //           });
  //         // console.log('DATA', (lala[clave]));
  //       }
  //     }
  //   });
  // }

  getConfiguraciones() {
    return this.http.get<Configuracioncv[]>(this.URL_CONF);
  }

  getConfiguracionesPersonalizadas(){
    return this.http.get<ConfiguracioncvPersonalizado[]>(this.URL_PERS);
  }

  getConfiguracionPersonalizada(id){
    return this.http.get(this.URL_PERS + id)
  }

  putConfiguracion(configuracion: Configuracioncv) {
    return this.http.put(this.URL_CONF + configuracion.id + '/', configuracion)
  }

  putConfiguracionPersonalizada(configuracionPersonalizada: ConfiguracioncvPersonalizado){
    return this.http.put(this.URL_PERS + configuracionPersonalizada.id + '/', configuracionPersonalizada )
  }

  getBloques(){
    return this.http.get<Bloque[]>(this.URL_BLOQUES)
  }

  deleteConfiguracion(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete(this.URL_CONF + id)
  }


  public createConfigracioncv(configuracioncv: Configuracioncv): Observable<Configuracioncv> {

    return this.http.post<Configuracioncv>(this.URL_CONF, configuracioncv);

  }
}
