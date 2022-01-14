import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Configuracioncv } from "../../models/configuracioncv.model";
import { Observable } from "rxjs/Observable";
import { servicioBloques } from '../../models/servicioBloque.model';
import { Bloque } from '../../models/bloque.model';
import { ConfiguracioncvService } from '../configuracioncv.service';
import { ConfiguracioncvPersonalizado } from '../../models/configuracioncvPersonalizado.model';


@Injectable({
  providedIn: 'root'
})
export class BloqueServicioService {

  urlSiac;
  arreglosUrl = [];
  urlEsquema;
  token = '54fc0dc20849860f256622e78f6868d7a04fbd30';
  URL_BLOQUES = "http://localhost:8000/api/bloque/";
  URL_CONF = 'http://localhost:8000/api/configuracioncv/';
  URL_SERVICIOS = 'http://localhost:8000/api/servicio/'
  URL_ELIMINA_OBJ = 'http://localhost:8000/api/elimina-objeto/';
  URL_ELIMINA_OBJ_BLOQUE = 'http://localhost:8000/api/elimina-objetobloque/';
  URL_ELIMINA_OBJE_CONFPERSONALIZADA = 'http://localhost:8000/api/elimina-objetoconfpersonalizada/';
  URL_PERS = "http://localhost:8000/api/configuracioncv_personalizado/";

  // bloquesservicio: any = [];
  bloquesservicio: servicioBloques[];
  bloquesDataBase: any = []
  claves: any = [];
  esquemas: any = [];
  arregloEsquema: any = []
  // arregloEsquemaBloques: any = []
  arregloBloquesEsquema: any = [];
  atrbutoEsquema;
  arregloBaseDatos;
  arregloBaseDatosBloques;
  nosimilitud: any = [];
  similitud: any = [];
  nosimilitudBloques: any = [];
  similitudBloques: any = [];


  constructor(
    private http: HttpClient,
    private configuracioncvService:ConfiguracioncvService

  ) { 
    this.getConfiguraciones().subscribe((res)=>{
      console.log("configuracionesBaseService", res)
    })

  }



  getServicios() {
    return this.http.get<servicioBloques[]>(this.URL_SERVICIOS);
  }

  // Configuraciones Generales
  getConfiguraciones() {
    return this.http.get<Configuracioncv[]>(this.URL_CONF);
  }

  /* Bloque */
  getBloques() {
    return this.http.get<Bloque[]>(this.URL_BLOQUES);
  }

  postConfiguraciones(bloque, atributo) {
    console.log("GUARDADO", bloque, atributo)
    const path = `${this.URL_CONF}`;
    let idUser = parseInt(localStorage.getItem('id_user')) 

    return this.http.post<Configuracioncv>(path, {
      bloque: bloque,
      atributo: atributo,
      orden: 1,
      visible_cv_resumido: false,
      visible_cv_completo: false,
      mapeo: atributo,
      usuario: idUser,
    }).subscribe((res => {
      console.log("resres", res)
    }));
  }


  bloques(url: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + this.token,
    });
    return this.http.get(url, { headers: headers });
  }



  copiaEsquemaAtributos() {
    this.getServicios().subscribe((dataBase) => {
      this.bloquesservicio = dataBase
      console.log('BLOQUESERVICIO', this.bloquesservicio);
      this.bloquesservicio.forEach((atributo) => {
        console.log("lalaatributo", atributo)
        this.urlSiac = atributo.url;
        this.arreglosUrl.push(this.urlSiac);
        console.log("URLARREGLOURL", this.arreglosUrl)
        this.bloques(this.urlSiac).subscribe((data) => {
          let keys = Object.keys(data.results[0]);
          // console.log('BLOQUE', atributo.bloqueNombre);
          for (let i = 0; i < keys.length; i++) {
            let clave = keys[i];
            console.log('Bloque - atributo',atributo.bloqueNombre, clave);
            // this.postConfiguraciones(atributo.bloqueNombre, clave);
            const datos = {
              bloque: atributo.bloqueNombre,
              atributo: clave
            }
            // console.log("DATOSCOPIAESQUEMA", datos)
            this.arregloEsquema.push(datos)
          }
          console.log("ARREGLOESQUEMA", this.arregloEsquema)

          // this.comparaEsquemaBaseDatosEliminarAtributo(this.arregloEsquema)
          this.compararEsquemaBaseDatosGuardarAtributo(this.arregloEsquema)
        });
      });
      console.log("ARREGLOESQUEMA", this.arregloEsquema)
      this.arregloEsquema = []


    },
      (error) => {
        console.log(error);
        // this.errorMessage = 
      }
    );
  }



  // Hace post en bloques
  postBloques(bloques) {
    const path = `${this.URL_BLOQUES}`;
    return this.http.post<Bloque>(path, {
      nombre: bloques,
    });
  }


  copiaEsquemaBloques() {
    this.getServicios().subscribe((dataBase) => {
      this.bloquesDataBase = dataBase
      console.log('BLOQUESERVICIO', this.bloquesDataBase);
      this.bloquesDataBase.forEach((bloque) => {
        this.urlSiac = bloque.url;
        this.arreglosUrl.push(this.urlSiac);
        this.bloques(this.urlSiac).subscribe((data) => {
          // let keys = Object.keys(data.results[0]);
          console.log('BLOQUECOPIA', bloque.bloqueNombre);
          const datos = {
            nombre: bloque.bloqueNombre,
          }
          this.arregloBloquesEsquema.push(datos)
          // }
          console.log("BLOQUESARREGLOESERVICIOS", this.arregloBloquesEsquema)

          // this.comparaEsquemaBaseDatosBloqueEliminar(this.arregloBloquesEsquema)
          this.compararEsquemaBaseDatosGuardarBloque(this.arregloBloquesEsquema)
          this.arregloBloquesEsquema = []

        });
      });
    });
  }


  compararEsquemaBaseDatosGuardarAtributo(arregloEsquema) {

    console.log("ARREGLOA", arregloEsquema)
    this.getConfiguraciones().subscribe((arregloBaseDatos) => {
      console.log("ARREGLOBASEDEDATOS", arregloBaseDatos)

      const aux = arregloEsquema.reduce((prev, curr) => {
        const item = arregloBaseDatos.find(x => x.atributo === curr.atributo && x.bloque === curr.bloque);

        if (!item) prev = [...prev, curr];

        return prev;
      }, []);
      console.log("AGUARDAR", aux)

      aux.forEach(objeto => {
        console.log('elementoaguardarBloqueAtributo', objeto.bloque, objeto.atributo);
        this.postConfiguraciones(objeto.bloque, objeto.atributo);

      });

    }, error => {
      console.log(error)
    })
  }


  compararEsquemaBaseDatosGuardarBloque(arregloEsquemaBloques) {

    console.log("ARREGLOABLOQUES", arregloEsquemaBloques)
    this.getBloques().subscribe((arregloBaseDatosBloques) => {
      console.log("ARREGLOBASEDEDATOS", arregloBaseDatosBloques)

      const aux = arregloEsquemaBloques.reduce((prev, curr) => {
        const item = arregloBaseDatosBloques.find(x => x.nombre === curr.nombre);

        if (!item) prev = [...prev, curr];

        return prev;
      }, []);
      console.log("AGUARDARBLOQUES", aux)

      aux.forEach(objeto => {
        console.log('elementoaguardarBloqueBloque', objeto.nombre);
        this.postBloques(objeto.nombre).subscribe((
          res => {
            console.log("RESBLOQUES", res)
          }
        ))

      });

    }, error => {
      console.log(error)
    })
  }


  //Elimina servicio
  deleteServicio(id: string) {
    return this.http.delete(this.URL_SERVICIOS + id)
  }

  //Elimina objeto de configuracion que no coincide con servicios de siac
  eliminaObjetoNoSimilarConfiguracion(bloque, atributo) {
    return this.http.get(this.URL_ELIMINA_OBJ + bloque + "/" + atributo)
  }



  //Elimina objeto de bloque que no coincide con servicios de siac
  eliminaObjetoNoSimilarBloque(bloque) {
    console.log("BLOQUEELMINAOBJETO", bloque)
    return this.http.get(this.URL_ELIMINA_OBJ_BLOQUE + bloque)
  }

  // http://localhost:8000/api/elimina-objetoconfpersonalizada/127/nuevocv/7t7bxkhiw4y/Articulos/area_conocimiento_especifica

  eliminaObjetoNoSimilarConfPersonalizada(iduser, nombre_cv, cv, bloque, atributo) {
    console.log("ATRIBUTOELMINAOBJETOPERSONALIZADOSERVICE", iduser, nombre_cv, cv, bloque, atributo)
    return this.http.get(this.URL_ELIMINA_OBJE_CONFPERSONALIZADA + iduser + '/' + nombre_cv + '/' + cv + '/' + bloque + '/' + atributo)
  }

  postObjetoNosimilarConfPersonalizada(configuracionPersonalizada) {
  
    console.log("DATAGUARDAR", configuracionPersonalizada)

    const path = `${this.URL_PERS}`;
    return this.http.post<ConfiguracioncvPersonalizado>(
      path,
      configuracionPersonalizada
    );

    // return this.http.get(this.URL_ELIMINA_OBJE_CONFPERSONALIZADA + )
  }


  postServicios(servicio) {
    return this.http.post<servicioBloques>(this.URL_SERVICIOS, servicio);
  }

  putServicios(servicio: servicioBloques) {
    return this.http.put(this.URL_SERVICIOS + servicio.id + "/", servicio);
  }



}
