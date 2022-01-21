import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvService } from '../../services/configuracioncv.service';
import * as _ from "lodash";
import { InfoDocenteService } from '../../services/info-docente/info-docente.service';
import { Usuario } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { CreaJsonService } from '../../services/creador-json/crea-json.service';
import { CreaDocxService } from '../../services/creador-docx/crea-docx.service';
// import { Angular2CsvModule } from 'angular2-csv';
import { CreaCsvService } from '../../services/creador-csv/crea-csv.service';
import { CreaTxtService } from '../../services/creador-txt/crea-txt.service';
import { AuthorizationService } from '../../services/login/authorization.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreaBibtexService } from '../../services/creador-bibtex/crea-bibtex.service';
import { PdfService } from '../../services/creador-pdf/crea-pdf.service';
import { BloqueServicioService } from '../../services/servicios-bloque/bloque-servicio.service';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.component.html',
  styleUrls: ['./guardados.component.css'],
})
export class GuardadosComponent implements OnInit {


  arreglo = [];
  confPersoDocente;
  confPersoDocenteCopia;
  infoDocente;
  confPersoDocenteClas = [];
  confPersoDocenteClasFormateadas = []
  dataDocente;
  docente;
  idParamsUrl;
  idUserStorage;
  configuraciones = []

  blob: any;
  pdfGenerado: any;
  isLoading = false;
  loadingText: string = '';

  valor = false;
  valorNombre;
  valorDocumento = false;
  tipoDocumento: string;
  hashCv: string;
  bloquesservicio = [];
  urlSiac;
  arregloEsquema: any = []
  bloquesOriginal;

  cvPersonalizado;

  filtradoBloques = [];
  arregloBloques = [];
  miDataInterior = []

  // docente;

  constructor(
    public configuracioncvService: ConfiguracioncvService,
    public infoDocenteService: InfoDocenteService,
    public pdfService: PdfService,
    public creaJsonService: CreaJsonService,
    public creaDocxService: CreaDocxService,
    public creacvService: CreaCsvService,
    public creatxtService: CreaTxtService,
    private activatedRoute: ActivatedRoute,
    public authorizationService: AuthorizationService,
    public creabibtexService: CreaBibtexService,
    private _snackBar: MatSnackBar,
    private bloqueServicioService: BloqueServicioService
  ) {

  }



  ngOnInit(): void {

    this.idParamsUrl = this.activatedRoute.snapshot.paramMap.get("id_user");
    this.idUserStorage = localStorage.getItem("id_user");
    localStorage.setItem('id_user', this.idParamsUrl);
    this.comprobarId()
    this.getConfigurcionPersonalizadaDocente()
    this.informacionDocente();
    this.compararArregloAtributos()
    this.configuracioncvService.getConfiguraciones().subscribe((res) => {
      this.configuraciones = res
    })

    this.getBloques();

    // this.in
  }


  comprobarId() {
    this.authorizationService.comprobarId(this.idParamsUrl)
    console.log("IDUSERGUARDADO", this.idParamsUrl, localStorage.getItem("id_user"))
  }

  compararArregloAtributos() {
    // console.log("CONFIGURACIONES", this.arregloConfiguraciones)
    this.bloqueServicioService.getServicios().subscribe(dataBase => {
      this.bloquesservicio = dataBase
      this.bloquesservicio.forEach((atributo) => {
        // console.log("nandoatributo", atributo)
        this.urlSiac = atributo.url;
        // this.arreglosUrl.push(this.urlSiac);
        this.bloqueServicioService.bloques(this.urlSiac).subscribe((data) => {
          let keys = Object.keys(data.results[0]);
          // console.log("LALADATA", atributo.bloqueNombre)

          for (let i = 0; i < keys.length; i++) {
            let clave = keys[i];
            // console.log('nonoatributo', clave);
            const datos = {
              bloque: atributo.bloqueNombre,
              atributo: clave
            }

            this.arregloEsquema.push(datos)

          }
          // console.log("guardadosmamaARREGLOESQUEMA", this.arregloEsquema)
          // console.log("ADATOSUSUARIO")
          // this.comparaEsquemaBaseDatosEliminarAtributo(this.arregloEsquema)
        });
      });
    });
  }





  getConfigurcionPersonalizadaDocente() {
    let iduser = localStorage.getItem("id_user");
    console.log("🚀 ~ file: guardados.component.ts ~ line 55 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ iduser", this.idParamsUrl)

    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(this.idParamsUrl)
      .subscribe(confPersoDocente => {
        this.confPersoDocente = confPersoDocente;
        // this.datos(this.confPersoDocente)
        console.log("🚀 ~ file: guardados.component.ts ~ line 198 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ confPersoDocente", confPersoDocente)

        this.confPersoDocenteClas = _.groupBy(this.confPersoDocente, (item) => {
          return [item['nombre_cv'], item['cv'], item['fecha_registro']];
        });

        console.log("🚀 ~ file: guardados.component.ts ~ line 126 ~ GuardadosComponent ~ this.confPersoDocenteClas=_.groupBy ~ this.confPersoDocenteClas", this.confPersoDocenteClas)

        this.confPersoDocenteClas = _.orderBy(_.keys(this.confPersoDocenteClas), (item) => {
          return item.split(',')[2];
        }, ['desc']).map(item => {
          return {
            [item]: this.confPersoDocenteClas[item]
          }
        });

        console.log("🚀 ~ file: guardados.component.ts ~ line 217 ~ GuardadosComponent ~ this.confPersoDocenteClas=_.orderBy ~ this.confPersoDocenteClas", this.confPersoDocenteClas)

        this.confPersoDocenteClasFormateadas = this.confPersoDocenteClas.map((item) => {
          let cv;
          // let data;

          Object.keys(item).forEach((entry, index) => {

            // Second index is the name but this time we need the key
            // and also its value gives you the data
            if (index === 0) {
              cv = entry;
              console.log("NAME", cv)
            }
          });
          return { cv };
        });
        console.log("🚀 ~ file: guardados.component.ts ~ line 208 ~ GuardadosComponent ~ this.confPersoDocenteClas=_.groupBy ~ this.confPersoDocenteClas", this.confPersoDocenteClasFormateadas)

      });
  }

  // datos(confPersoDocente) {
  //     console.log("DATOSDOCENTE", confPersoDocente)
  // }




  deleteConfiguracionPersonalizada(nombreCv, cvHash) {
    console.log("AELIMINAR", nombreCv)
    // console.log("AELIMINAR", nombreCv)
    // console.log("🚀 ~ file: guardados.component.ts ~ line 108 ~ GuardadosComponent ~ getConfiguracionPersonalizada ~ arreglo", this.confPersoDocente)

    let datos = _.filter(this.confPersoDocente, { 'nombre_cv': nombreCv, 'cv': cvHash });
    console.log(datos)

    this.configuracioncvService.deleteConfiguracionesPersonalizadas(nombreCv, cvHash).subscribe((res => {
        console.log(res);
        this.getConfigurcionPersonalizadaDocente()
    }))

    // let datos = _.filter(this.confPersoDocente, { 'nombre_cv': nombreCv, 'cv': cvHash });
    // console.log("DATOS", datos)

    // datos.forEach(element => {
    //   console.log("ELEMENTELIMIARPERSONALIZADO", element.id, element.nombre_cv)
    //   this.configuracioncvService.deleteConfiguracionPersonalizada(element.id).subscribe((res => {
    //     console.log(res);
    //     this.getConfigurcionPersonalizadaDocente()
    //   }))
    // });

   
    this._snackBar.open("Se eliminó " + nombreCv, "Cerrar", {
      duration: 2000,
    });
  }





  metodosBtnEditar(nombre_cv, cvHash) {
    console.log("metodosBtnEditar", nombre_cv, cvHash)

    this.eliminaObjetoConPersonalizada(nombre_cv, cvHash)
    this.guardaObjetoConfPersonalizada(nombre_cv, cvHash);
    this.editaobjetoConfPersonalizada(nombre_cv, cvHash);

    console.log("DOCENTE", this.docente.cedula)

    // this.guardarBloquesConfPersonalizada(nombre_cv, cvHash)
    // this.generaPdfPersonalizado(nombre_cv, cvHash)

  }


  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques, ['ordenPersonalizable',], ['asc'])
        this.arregloBloques = atributosOrdenados
        console.log("🚀 ~ file: bloques ~ line 188 ~ PersonalizadoCvComponent ~ getBloques ~ atributosOrdenados", this.arregloBloques)

        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
  }



  //Elimina objetos que no coinciden con esquema de informacion de SIAC
  eliminaObjetoConPersonalizada(nombre_cv, cvHash) {
    let iduser = localStorage.getItem("id_user");
    
    this.confPersoDocenteCopia = this.confPersoDocente.filter(data =>
      data.nombre_cv === nombre_cv && data.cv === cvHash
    )

    console.log("PERSONALIZADOS", this.confPersoDocenteCopia)
    console.log("lalamamaARREGLOESQUEMA", this.arregloEsquema)


    const aux = this.confPersoDocenteCopia.reduce((prev, curr) => {
      const item = this.arregloEsquema.find(
        (x) =>
          x.bloque === curr.bloque
          && x.atributo === curr.atributo
      );

      if (!item) prev = [...prev, curr];

      return prev;
    }, []);

    console.log("aeliminararregloAtributos", aux);


    aux.forEach(objeto => {
      console.log('tributoelementoaborrarobjetoConfiguracion', objeto.id, iduser, objeto.nombre_cv, objeto.cv, objeto.bloque, objeto.atributo);
      this.bloqueServicioService.deleteConfiguracionPersonalizada(objeto.id)
        .subscribe((res) => {
          console.log("RESELIMNAR", res)
        })
    });

    console.log("GENERAPDF")
  }




  // Guarda Objeto de configuraciones en configuraciones Personalozadas
  guardaObjetoConfPersonalizada(nombre_cv, cvHash) {
    let iduser = localStorage.getItem("id_user");


    console.log("PARSEINT", this.confPersoDocente)

    this.confPersoDocenteCopia = this.confPersoDocente.filter(data =>
      data.nombre_cv === nombre_cv && data.cv === cvHash
    )


    console.log("PERSONALIZADOS", this.confPersoDocenteCopia)
    console.log("ARREGLOESQUEMA", this.arregloEsquema)



    // Crea arreglo con los elementos a guardar desde datos SIAC que no estan en configuracion personalizada
    const auxiliar = this.arregloEsquema.reduce((prev, curr) => {
      const itemaux = this.confPersoDocenteCopia.find(
        (x) => x.atributo === curr.atributo && x.bloque === curr.bloque
      );

      if (!itemaux) prev = [...prev, curr];

      return prev;
    }, []);

    console.log("aguardararregloAtributos", auxiliar);


    let uniqueArray
    // Recorre arreglo y guarda objetos en configuracion personalizada
    let configuracion;

    let configuracionesPersonal: any = []

    var orden = 1

    let fecha;

    auxiliar.forEach(objeto => {
      console.log("BLOQUELALALA", objeto)
      this.infoDocente = this.confPersoDocenteCopia


      console.log("objetoinfoDocente", objeto)
      console.log("lalainfoDocente", this.infoDocente.length)

      // console.log("ORDEN", orden++)

      const arreglo: any = []
      this.infoDocente.forEach(element => {
        const objeto = {
          bloque: element.bloque,
          visible_cv_bloque: element.visible_cv_bloque,
          fecha_registro: element.fecha_registro,
          ordenPersonalizable: element.ordenPersonalizable
        }
        arreglo.push(objeto)
      });

      console.log('PUSHARREGLO', arreglo)

      uniqueArray = arreglo.filter((thing, index) => {
        const _thing = JSON.stringify(thing);
        return index === arreglo.findIndex(obj => {
          return JSON.stringify(obj) === _thing;
        });
      });

      console.log("ARREGLOS", uniqueArray)


      if (this.infoDocente.length == 0) {
        console.log("LONGITUD", this.infoDocente.length)
      } else {
        console.log("LONGITUD", this.infoDocente.length)

      }

      uniqueArray.forEach(element => {
        console.log("ELEMENT", element)


        configuracion = {
          id_user: Number(iduser),
          bloque: objeto.bloque,
          atributo: objeto.atributo,
          orden: orden,
          visible_cv_personalizado: true,
          mapeo: objeto.atributo,
          cv: cvHash,
          nombre_cv: nombre_cv,
          fecha_registro: element.fecha_registro,
          cedula: this.docente.cedula,
          nombreBloque: objeto.bloque,
          ordenPersonalizable: element.ordenPersonalizable,
          visible_cv_bloque: element.visible_cv_bloque
        }

        console.log('tributoelementoaguardarAtributoPersonalizado', iduser, nombre_cv, cvHash, objeto.bloque, objeto.atributo, element.fecha_registro, element.ordenPersonalizable, element.visible_cv_bloque, orden);

        fecha = element.fecha_registro
      });

      configuracionesPersonal.push(configuracion)
      console.log("mamaconfiguracion", configuracion)



    });


    console.log("mamamaconfiguracion", configuracionesPersonal)
    console.log("arregloBloques", this.arregloBloques)


    // configuracionesPersonal.forEach(atributo => {
    //   console.log("configuracionPersguardar", atributo)
    //   this.arregloBloques.forEach(bloque => {
    //     console.log("BLOQUEGUARDR", bloque)
    //     if (atributo.bloque === bloque.nombre) {
    //       console.log("SON IGUALES", atributo.bloque, bloque.nombre, atributo.orden)
    //       const data = {
    //         id_user: Number(iduser),
    //         bloque: atributo.bloque,
    //         atributo: atributo.atributo,
    //         orden: bloque.ordenCompleto,
    //         visible_cv_personalizado: atributo.visible_cv_completo,
    //         mapeo: atributo.mapeo,
    //         cv: cvHash,
    //         nombre_cv: nombre_cv,
    //         fecha_registro: fecha,
    //         cedula: iduser,
    //         nombreBloque: bloque.nombre,
    //         ordenPersonalizable: bloque.ordenCompleto,
    //         visible_cv_bloque: bloque.visible_cv_bloqueCompleto
    //       }
    //       this.miDataInterior.push(data);
    //     }

    //   });

    //   // this.bloqueServicioService.postObjetoNosimilarConfPersonalizada(element)
    //   //   .subscribe((res) => {
    //   //     console.log("atributoguardadopersonalizada", element)
    //   //   }, (error) => {
    //   //     console.log(error)
    //   //   })
    // });

    // console.log("miDataInterior", this.miDataInterior)



    let datosConfiguraciones
    configuracionesPersonal.forEach(element => {
      datosConfiguraciones = this.configuraciones.filter(data => data.bloque === element.bloque && data.atributo === element.atributo)
      console.log("datosConfiguraciones", datosConfiguraciones)
      datosConfiguraciones.forEach(atributo => {
        console.log("ATRIBUTO", atributo)
        this.arregloBloques.forEach(bloque => {
          console.log("BLOQUEGUARDR", bloque)
          if (atributo.bloque === bloque.nombre) {
            console.log("SON IGUALES", atributo.bloque, bloque.nombre, atributo.orden)
            const objetoPersonalizado = {
              id_user: Number(iduser),
              bloque: atributo.bloque,
              atributo: atributo.atributo,
              orden: atributo.ordenCompleto,
              visible_cv_personalizado: atributo.visible_cv_completo,
              mapeo: atributo.mapeo,
              cv: cvHash,
              nombre_cv: nombre_cv,
              fecha_registro: fecha,
              cedula: this.docente.cedula,
              nombreBloque: bloque.nombre,
              ordenPersonalizable: bloque.ordenCompleto,
              visible_cv_bloque: bloque.visible_cv_bloqueCompleto
            }

            console.log("guardardata", objetoPersonalizado)
            // this.miDataInterior.push(data);

            this.bloqueServicioService.postObjetoNosimilarConfPersonalizada(objetoPersonalizado)
              .subscribe((res) => {
                console.log("atributoguardadopersonalizada", objetoPersonalizado)
              }, (error) => {
                console.log(error)
              })
          }
        });
      });

    });


    configuracionesPersonal = []


  }



  // guardarBloquesConfPersonalizada(configuracionPersonalizada, iduser, nombre_cv, cvHash, fecha) {
  //   // let iduser = localStorage.getItem("id_user");


  //   console.log('nanaconfiguracionPersonalizada', configuracionPersonalizada, iduser, nombre_cv, cvHash, fecha)
  //   console.log("CONFIGURACIONESGUARDAR", this.configuraciones)

  //   let datosConfiguraciones
  //   configuracionPersonalizada.forEach(element => {
  //     datosConfiguraciones = this.configuraciones.filter(data => data.bloque === element.bloque && data.atributo === element.atributo)
  //     console.log("datosConfiguraciones", datosConfiguraciones)
  //     datosConfiguraciones.forEach(atributo => {
  //       console.log("ATRIBUTO", atributo)
  //       this.arregloBloques.forEach(bloque => {
  //         console.log("BLOQUEGUARDR", bloque)
  //         if (atributo.bloque === bloque.nombre) {
  //           console.log("SON IGUALES", atributo.bloque, bloque.nombre, atributo.orden)
  //           const data = {
  //             id_user: Number(iduser),
  //             bloque: atributo.bloque,
  //             atributo: atributo.atributo,
  //             orden: atributo.ordenCompleto,
  //             visible_cv_personalizado: atributo.visible_cv_completo,
  //             mapeo: atributo.mapeo,
  //             cv: cvHash,
  //             nombre_cv: nombre_cv,
  //             fecha_registro: fecha,
  //             cedula: iduser,
  //             nombreBloque: bloque.nombre,
  //             ordenPersonalizable: bloque.ordenCompleto,
  //             visible_cv_bloque: bloque.visible_cv_bloqueCompleto
  //           }

  //           // console.log("guardardata", data)
  //           // this.miDataInterior.push(data);
  //         }

  //       });
  //     });

  //   });



  //   console.log("DATOSLALA", datosConfiguraciones)


  //   if (!configuracionPersonalizada) return throwError("null data");


  //   configuracionPersonalizada.forEach(element => {
  //     console.log("configuracionPersguardar", element)
  //   });




  //   datosConfiguraciones.forEach(atributo => {
  //     console.log("ATRIBUTO", atributo)
  //     this.arregloBloques.forEach(bloque => {
  //       console.log("BLOQUEGUARDR", bloque)
  //       if (atributo.bloque === bloque.nombre) {
  //         console.log("SON IGUALES", atributo.bloque, bloque.nombre, atributo.orden)
  //         const data = {
  //           id_user: Number(iduser),
  //           bloque: atributo.bloque,
  //           atributo: atributo.atributo,
  //           orden: atributo.ordenCompleto,
  //           visible_cv_personalizado: atributo.visible_cv_completo,
  //           mapeo: atributo.mapeo,
  //           cv: cvHash,
  //           nombre_cv: nombre_cv,
  //           fecha_registro: fecha,
  //           cedula: iduser,
  //           nombreBloque: bloque.nombre,
  //           ordenPersonalizable: bloque.ordenCompleto,
  //           visible_cv_bloque: bloque.visible_cv_bloqueCompleto
  //         }
  //         this.miDataInterior.push(data);
  //       }

  //     });
  //   });



  //   console.log("sasaconfigurac", this.miDataInterior);

  //   this.miDataInterior.forEach(element => {
  //     console.log('configuracionPersonalizadaELEMENT', element)
  //     // this.bloqueServicioService.postObjetoNosimilarConfPersonalizada(element)
  //     //   .subscribe((res) => {
  //     //     console.log("atributoguardadopersonalizada", element)
  //     //   }, (error) => {
  //     //     console.log(error)
  //     //   })

  //   });

  //   this.miDataInterior = []


  // }


  editaobjetoConfPersonalizada(nombre_cv, cvHash) {
    let iduser = localStorage.getItem("id_user");



    let configuraionesPersonalizadas = []
    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente => {
        this.cvPersonalizado = confPersoDocente;
        configuraionesPersonalizadas = this.cvPersonalizado.filter(data =>
          data.nombre_cv === nombre_cv && data.cv === cvHash
        )

        console.log("EDICIONPERSONALIZADOS", configuraionesPersonalizadas)
        // console.log("CONFIGURACIONES", this.configuracionesPrueba)
        console.log("CONFIGURACIONES", this.configuraciones)

        this.configuraciones.forEach((atributo) => {
          // para eficiencia se puede comprobar si el registro actual (atributo)
          // se ha modificado. Si sus campos son iguales al original entonces
          // no es necesario guardarlo
          // console.log("atributo", atributo)
          let atribtutoOriginal = configuraionesPersonalizadas.find((b) => b.atributo === atributo.atributo && b.bloque === atributo.bloque);
          // data.push(atribtutoOriginal)
          // console.log('atribtutoOriginal', atribtutoOriginal.atributo, atributo.atributo)

          // if (!atribtutoOriginal)

          if (!atribtutoOriginal || (atribtutoOriginal.bloque == atributo.bloque && atribtutoOriginal.mapeo == atributo.mapeo))
            return;

          const objetoEditar = {
            id: atribtutoOriginal.id,
            bloque: atribtutoOriginal.bloque,
            atributo: atribtutoOriginal.atributo,
            orden: atribtutoOriginal.orden,
            visible_cv_personalizado: atribtutoOriginal.visible_cv_personalizado,
            mapeo: atributo.mapeo,
            cv: atribtutoOriginal.cv,
            nombre_cv: atribtutoOriginal.nombre_cv,
            fecha_registro: atribtutoOriginal.fecha_registro,
            cedula: this.docente.cedula,
            nombreBloque: atribtutoOriginal.nombreBloque,
            ordenPersonalizable: atribtutoOriginal.ordenPersonalizable,
            visible_cv_bloque: atribtutoOriginal.visible_cv_bloque,
            id_user: Number(atribtutoOriginal.id_user)
          }

          console.log("seedita", objetoEditar)

          this.configuracioncvService
            .putConfiguracionPersonalizada(objetoEditar)
            .subscribe((res) => {
              console.log("RESEDITARPERSONALIZADO", res)
              // this.getConfiguracionPersonalizada(bloque);
            });

        });

      });
  }

  generaPdfPersonalizado(nombre_cv, cvHash) {

    this.metodosBtnEditar(nombre_cv, cvHash)
    // this.editaobjetoConfPersonalizada(nombre_cv, cvHash);

    console.log("NOMBRECV", nombre_cv, Number(this.idUserStorage), this.valor, cvHash)
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "PDF";
    this.hashCv = cvHash;


    console.log("GENERANDO PDF")

    this.pdfService.generaPdfPersonalizado(this.idUserStorage, nombre_cv, cvHash).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL);
      window.open(downloadURL);
      this.valor = false;
    }, (error) => {
      if (error) return throwError("null data");

    });
  }


  generaDocPersonalizado(nombre_cv, cvHash) {
    this.metodosBtnEditar(nombre_cv, cvHash)
    // this.editaobjetoConfPersonalizada(nombre_cv, cvHash);

    console.log("DOCPERSO", nombre_cv);
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "DOCX"
    this.hashCv = cvHash;

    this.creaDocxService.generaDocPersonalizado(this.idUserStorage, nombre_cv, cvHash).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/msword' });
      var downloadURL = window.URL.createObjectURL(data);
      console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "doc_personalizado.docx";
      link.click();
      this.valor = false;
    });
  }


  generaJsonPersonalizado(nombre_cv, cvHash) {
    this.metodosBtnEditar(nombre_cv, cvHash)

    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "JSON"
    this.hashCv = cvHash;

    this.creaJsonService.generaJsonPersonalizado(this.idUserStorage, nombre_cv, cvHash).subscribe((data) => {
      // console.log(data);
      this.blob = new Blob([data as BlobPart], { type: 'application/json' });
      var downloadURL = window.URL.createObjectURL(data);
      // console.log(downloadURL)
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = "cv_personalizado.json";
      link.click();
      this.valor = false;
    });
  }


  informacionDocente() {
    let iduser = localStorage.getItem("id_user");
    
    this.infoDocenteService.getInfoDocente(this.idParamsUrl).subscribe((res) => {
      console.log("INFODOCENTE", res)
      this.docente = res;
    })

    

  }


}
