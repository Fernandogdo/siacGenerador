import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvService } from '../../services/configuracioncv.service';
import * as _ from "lodash";
import { InfoDocenteService } from '../../services/info-docente/info-docente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreaJsonService } from '../../services/creador-json/crea-json.service';
import { CreaDocxService } from '../../services/creador-docx/crea-docx.service';
import { CreaCsvService } from '../../services/creador-csv/crea-csv.service';
import { CreaTxtService } from '../../services/creador-txt/crea-txt.service';
import { AuthorizationService } from '../../services/login/authorization.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreaBibtexService } from '../../services/creador-bibtex/crea-bibtex.service';
import { PdfService } from '../../services/creador-pdf/crea-pdf.service';
import { BloqueServicioService } from '../../services/servicios-bloque/bloque-servicio.service';


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
    localStorage.setItem('id_user', this.idParamsUrl);
    this.idUserStorage = localStorage.getItem("id_user");

    this.comprobarId()
    this.getConfigurcionPersonalizadaDocente()
    this.informacionDocente();
    this.compararArregloAtributos()
    this.configuracioncvService.getConfiguraciones().subscribe((res) => {
      this.configuraciones = res
    })

    this.getBloques();
  }


  comprobarId() {
    this.authorizationService.comprobarId(this.idParamsUrl)
    // console.log("IDUSERGUARDADO", this.idParamsUrl, localStorage.getItem("id_user"))
  }

  compararArregloAtributos() {
    this.bloqueServicioService.getServicios().subscribe(dataBase => {
      this.bloquesservicio = dataBase
      this.bloquesservicio.forEach((atributo) => {
        // console.log("nandoatributo", atributo)
        this.urlSiac = atributo.url;
        // this.arreglosUrl.push(this.urlSiac);
        this.bloqueServicioService.bloques(this.urlSiac).subscribe((data) => {
          let keys = Object.keys(data.results[0]);

          for (let i = 0; i < keys.length; i++) {
            let clave = keys[i];
            // console.log('nonoatributo', clave);
            const datos = {
              bloque: atributo.bloqueNombre,
              atributo: clave
            }

            this.arregloEsquema.push(datos)
          }
        });
      });
    });
  }


  getConfigurcionPersonalizadaDocente() {
    let iduser = localStorage.getItem("id_user");

    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(this.idParamsUrl)
      .subscribe(confPersoDocente => {
        this.confPersoDocente = confPersoDocente;

        this.confPersoDocenteClas = _.groupBy(this.confPersoDocente, (item) => {
          return [item['nombre_cv'], item['cv'], item['fecha_registro']];
        });

        this.confPersoDocenteClas = _.orderBy(_.keys(this.confPersoDocenteClas), (item) => {
          return item.split(',')[2];
        }, ['desc']).map(item => {
          return {
            [item]: this.confPersoDocenteClas[item]
          }
        });

        this.confPersoDocenteClasFormateadas = this.confPersoDocenteClas.map((item) => {
          let cv;

          Object.keys(item).forEach((entry, index) => {

            // Second index is the name but this time we need the key
            // and also its value gives you the data
            if (index === 0) {
              cv = entry;
            }
          });
          return { cv };
        });

      });
  }


  deleteConfiguracionPersonalizada(nombreCv, cvHash) {
    
    let datos = _.filter(this.confPersoDocente, { 'nombre_cv': nombreCv, 'cv': cvHash });

    this.configuracioncvService.deleteConfiguracionesPersonalizadas(nombreCv, cvHash).subscribe((res => {
      this.getConfigurcionPersonalizadaDocente()
    }))

    this._snackBar.open("Se eliminó " + nombreCv, "Cerrar", {
      duration: 2000,
    });
  }


  metodosBtnEditar(nombre_cv, cvHash) {
    this.eliminaObjetoConPersonalizada(nombre_cv, cvHash);
    this.guardaObjetoConfPersonalizada(nombre_cv, cvHash);
    this.editaobjetoConfPersonalizada(nombre_cv, cvHash);
  }

  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques, ['ordenPersonalizable',], ['asc'])
        this.arregloBloques = atributosOrdenados
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

    const aux = this.confPersoDocenteCopia.reduce((prev, curr) => {
      const item = this.arregloEsquema.find(
        (x) =>
          x.bloque === curr.bloque
          && x.atributo === curr.atributo
      );

      if (!item) prev = [...prev, curr];

      return prev;
    }, []);

    aux.forEach(objeto => {
      // console.log('tributoelementoaborrarobjetoConfiguracion', objeto.id, iduser, objeto.nombre_cv, objeto.cv, objeto.bloque, objeto.atributo);
      this.bloqueServicioService.eliminaObjetoNoSimilarConfPersonalizada(iduser, objeto.nombre_cv, objeto.cv, objeto.bloque, objeto.atributo)
        .subscribe((res) => {
        })

      // this.bloqueServicioService.deleteConfiguracionPersonalizada(objeto.id).subscribe((res)=>{
      //   console.log(res)
      // })
    });
  }


  // Guarda Objeto de configuraciones en configuraciones Personalozadas
  guardaObjetoConfPersonalizada(nombre_cv, cvHash) {
    let iduser = localStorage.getItem("id_user");

    this.confPersoDocenteCopia = this.confPersoDocente.filter(data =>
      data.nombre_cv === nombre_cv && data.cv === cvHash
    )
    // Crea arreglo con los elementos a guardar desde datos SIAC que no estan en configuracion personalizada
    const auxiliar = this.arregloEsquema.reduce((prev, curr) => {
      const itemaux = this.confPersoDocenteCopia.find(
        (x) => x.atributo === curr.atributo && x.bloque === curr.bloque
      );

      if (!itemaux) prev = [...prev, curr];

      return prev;
    }, []);

    let uniqueArray
    // Recorre arreglo y guarda objetos en configuracion personalizada
    let configuracion;

    let configuracionesPersonal: any = []

    var orden = 1

    let fecha;

    auxiliar.forEach(objeto => {
      this.infoDocente = this.confPersoDocenteCopia;

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

      uniqueArray = arreglo.filter((thing, index) => {
        const _thing = JSON.stringify(thing);
        return index === arreglo.findIndex(obj => {
          return JSON.stringify(obj) === _thing;
        });
      });

      uniqueArray.forEach(element => {

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

        fecha = element.fecha_registro
      });

      configuracionesPersonal.push(configuracion)
    });

    let datosConfiguraciones
    configuracionesPersonal.forEach(element => {
      datosConfiguraciones = this.configuraciones.filter(data => data.bloque === element.bloque && data.atributo === element.atributo)
      datosConfiguraciones.forEach(atributo => {
        this.arregloBloques.forEach(bloque => {
          if (atributo.bloque === bloque.nombre) {
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

            this.bloqueServicioService.postObjetoNosimilarConfPersonalizada(objetoPersonalizado)
              .subscribe((res) => {
              }, (error) => {
                console.log(error)
              })
          }
        });
      });

    });
    configuracionesPersonal = []
  }

  editaobjetoConfPersonalizada(nombre_cv, cvHash) {
    let iduser = localStorage.getItem("id_user");
    let configuraionesPersonalizadas = []
    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente => {
        this.cvPersonalizado = confPersoDocente;
        configuraionesPersonalizadas = this.cvPersonalizado.filter(data =>
          data.nombre_cv === nombre_cv && data.cv === cvHash
        )

        this.configuraciones.forEach((atributo) => {
          // para eficiencia se puede comprobar si el registro actual (atributo)
          // se ha modificado. Si sus campos son iguales al original entonces
          // no es necesario guardarlo
          // console.log("atributo", atributo)
          let atribtutoOriginal = configuraionesPersonalizadas.find((b) => b.atributo === atributo.atributo && b.bloque === atributo.bloque);

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

          this.configuracioncvService
            .putConfiguracionPersonalizada(objetoEditar)
            .subscribe((res) => {
              // this.getConfiguracionPersonalizada(bloque);
            });
        });
      });
  }

  generaPdfPersonalizado(nombre_cv, cvHash) {

    this.metodosBtnEditar(nombre_cv, cvHash)
    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "PDF";
    this.hashCv = cvHash;

    this.pdfService.generaPdfPersonalizado(this.idUserStorage, nombre_cv, cvHash).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/pdf' });
      var downloadURL = window.URL.createObjectURL(data);
      window.open(downloadURL);
      this.valor = false;
    });
  }


  generaDocPersonalizado(nombre_cv, cvHash) {
    this.metodosBtnEditar(nombre_cv, cvHash)

    this.valor = true;
    this.valorNombre = nombre_cv;
    this.tipoDocumento = "DOCX"
    this.hashCv = cvHash;

    this.creaDocxService.generaDocPersonalizado(this.idUserStorage, nombre_cv, cvHash).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/msword' });
      var downloadURL = window.URL.createObjectURL(data);
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

    this.creaJsonService.generaJsonPersonalizado(this.idUserStorage, nombre_cv, cvHash).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'application/json' });
      var downloadURL = window.URL.createObjectURL(data);
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
      this.docente = res;
    });
  }

}
