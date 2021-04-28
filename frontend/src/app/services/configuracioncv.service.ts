import { Observable } from 'rxjs/Observable';
import { Configuracioncv } from './../models/configuracioncv.model';
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { post } from 'jquery';
import { Bloque } from 'app/models/bloque.model';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracioncvService {

  URL_CONF = 'http://127.0.0.1:8000/api/configuracioncv'


  URL_BLOQUES = 'http://127.0.0.1:8000/api/bloque/';

  claves: any = [];
  esquemas: any = [];


  selectedConfiguracion: Configuracioncv = {
    administrador: 1,
    bloque: '',
    atributo:'',
    orden: 0,
    mapeo:'',
    visible_cv_completo: true,
    visible_cv_resumido: true,
  };
  configuraciones:Configuracioncv[];

  constructor(
    private http: HttpClient
  ) {
    this.test()
    this.getJSON().subscribe(data => {
      console.log('DATASERVICE', data.components.schemas);
    });

    this.getConfiguraciones()
    // this.postBloques().subscribe(res =>{
    //   console.log('QUEQUESAD',res);
    // })
  }

  postBloques(datos) {
    const httpOptions = {
      headers: new HttpHeaders
      ({'Content-Type': 'application/json'})
    }

    const object = [
      "Articulos", "ArticulosAutores", "Libros", "LibrosAutores",  "Proyectos" , "ProyectosParticipantes" ,"GradoAcademico", "Capacitacion"
    ]
      // {0: "Articulos", 1: "ArticulosAutores", 2: "Libros", 3: "LibrosAutores", 4: "Proyectos" , 5: "ProyectosParticipantes" ,6: "GradoAcademico", 7: "Capacitacion"}

    

    // const params = new HttpParams({
    //   fromObject: object
    // })

    const path = `${this.URL_BLOQUES}`;
    
    return this.http.post(path, datos)

    // let params = JSON.stringify(bloque); 




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

      console.log(claves);
      this.esquemas = Object.entries(data.components.schemas);
      // let array = Object.entries(data.components.schemas);

      // console.log(Object.entries(data.components.schemas['Articulos']['properties']));
      // console.log('DATOSDA', this.esquemas)

      // this.esquemas.forEach(element => {
      //   this.esquemas = element[0]

      // });

      this.claves = Object.keys(lala);
      let keys = Object.keys(lala)
      // console.log('claves',keys)

      for (let i = 0; i < keys.length; i++) {
        let clave = keys[i];

        this.postBloques(lala[clave]).subscribe(res=>{
          console.log('DATA', res)
        });
        console.log('DATA', lala[clave]);

      }

      // for (let bloque of this.claves) {

      //   console.log('FORFOR',bloque)
      //   this.postBloques(bloque).subscribe(
      //     res => {
      //       console.log('FORFOR',res);
      //     }
      //   )
      // }


    });
  }

  public getJSON(): Observable<any> {
    return this.http.get("../../assets/esquema/esquemasiac.json")
  }


  getConfiguraciones(){
    return this.http.get<Configuracioncv[]>(this.URL_CONF + '/')
  }

  putConfiguracion(configuracion: Configuracioncv){
    return this.http.put(`${this.URL_CONF}/${configuracion.id}/`, configuracion)
  }

  deleteConfiguracion(id:string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete(this.URL_CONF+'/'+id)
  }


  public createConfigracioncv(configuracioncv: Configuracioncv): Observable<Configuracioncv> {

    return this.http.post<Configuracioncv>(this.URL_CONF, configuracioncv);

  }
}
