import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfiguracioncvService } from '../../services/configuracioncv.service';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Bloque } from '../../models/bloque.model';
import { AuthorizationService } from '../../services/login/authorization.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "lodash";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { InfoDocenteService } from '../../services/info-docente/info-docente.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-personalizado-cv',
  templateUrl: './personalizado-cv.component.html',
  styleUrls: ['./personalizado-cv.component.css']
})
export class PersonalizadoCvComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['visible_cv_bloqueCompleto', 'nombre', 'ordenPersonalizable', 'ingreso'];
  dataSource;

  arregloBloques = [];
  arregloBloquesConfiguracion = []
  arregloAtributos = []
  bloquesOriginal;

  form: FormGroup;

  cvHash;
  nombre_cv;
  data_user;
  id_user;
  miDataInterior = [];
  parentSelector: boolean = false;
  id;
  dataBloque = [];
  isDisabled = true;
  isDisabledBtn = true;
  idParamsUrl;
  docente;


  constructor(
    public authorizationService: AuthorizationService,
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private infoDocenteService: InfoDocenteService,
    private activatedRoute: ActivatedRoute,


  ) {



    this.form = this.fb.group({
      nombrecv: ['', Validators.required],
      orden: [1]
    })
  }

  ngOnInit(): void {

    this.getConfiguracionPersonalizada();
    this.getConfiguracion();
    this.getBloques();
    this.informacionDocente();
    this.setIntrvl();
    this.id_user = localStorage.getItem("id_user");
    this.authorizationService.getOneUser(this.id_user)
      .subscribe(res => {
        this.data_user = res;
      });
  }

  public showDiv(): boolean {
    const name = this.form.value.nombrecv;
    return !!name;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  PostConfiguracionPersonalizada() {
    console.log(this.miDataInterior);

    for (let i = 0; i < this.miDataInterior.length; i++) {
      let clave = this.miDataInterior[i];
      console.log('CLAVE', clave)
      this.configuracioncvService.postConfiguracionPersonalizada(clave)
        .subscribe(res => {
          this._snackBar.open('Guardado Correctamente', "Cerrar", {
            duration: 2000,
          });
          console.log('SEGUARDO', res)
        })
    }
  }

  getConfiguracionPersonalizada() {
    this.configuracioncvService.getConfiguracionesPersonalizadas().subscribe(
      res => {
        this.configuracioncvService.configuracionesPersonalizadas = res;
      },
      err => console.log(err)
    )
  }

  getConfiguracion() {
    this.configuracioncvService.getConfiguraciones().subscribe(
      res => {
        this.configuracioncvService.configuraciones = res;

        this.arregloAtributos = res;

        this.arregloBloquesConfiguracion = res.reduce(function (r, a) {
          r[a.bloque] = r[a.bloque] || [];
          r[a.bloque].push(a);
          return r;
        }, Object.create(null));

      },
      err => console.log(err)
    )
  }


  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques, ['ordenPersonalizable',], ['asc'])
        this.arregloBloques = atributosOrdenados

        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
  }

  editBloque(bloque: Bloque) {
    this.configuracioncvService.putBloque(bloque).subscribe
      (res => {
        this._snackBar.open('Guardado Correctamente', "Cerrar", {
          duration: 2000,
        });
      })
  }

  valor(id) {
    this.id = id
    console.log('id', this.id)
  }

  onChangeBloque($event) {
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.arregloBloques = this.arregloBloques.map((d) => {
      if (d.id == id) {
        d.visible_cv_bloqueCompleto = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.visible_cv_bloqueCompleto = this.parentSelector;
        return d;
      }
      return d;
    });
  }


  setIntrvl() {
    // setTimeout(() => this.compararArregloAtributos(), 6000);
    setInterval(() => this.actualizaOrdenPersonalizable(), 30000);
  }


  actualizaOrdenPersonalizable() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if (bloqueOriginal.ordenPersonalizable == bloque.ordenCompleto &&
        bloqueOriginal.visible_cv_bloqueCompleto == bloque.visible_cv_bloqueCompleto) return
      const objeto = {
        id: bloque.id,
        nombre: bloque.nombre,
        nombreService:bloque.nombreService,
        ordenCompleto: bloque.ordenCompleto,
        ordenPersonalizable: bloque.ordenCompleto,
        ordenResumido: bloque.ordenResumido,
        visible_cv_bloqueCompleto: bloque.visible_cv_bloqueCompleto,
        visible_cv_bloqueResumido: bloque.visible_cv_bloqueResumido
      }
      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService.putBloque(objeto).subscribe((res) => {
        this.getBloques();
      });
      // this._snackBar.open("Se guardó correctamente", "Cerrar", {
      //   duration: 2000,
      // });
    });
  }

  guardar() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if (bloqueOriginal.ordenPersonalizable == bloque.ordenPersonalizable &&
        bloqueOriginal.visible_cv_bloqueCompleto == bloque.visible_cv_bloqueCompleto) return
      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService.putBloque(bloque).subscribe((res) => {
        this.getBloques();
      });
      this._snackBar.open("Se guardó correctamente", "Cerrar", {
        duration: 2000,
      });
    });
  }


  guardarAtributos() {
    let now = new Date();
    let iduser = localStorage.getItem("id_user");
    this.nombre_cv = this.nombre_cv.replace(/=|\?|\+|#|_| |\/|'|"|\(|\)|&|\*|\$|`|~|@|%|\||\\|<|>|{|}|\[|\]|\.|\,|\^|\;|\:|!|¡|º|ª/g, '')

    const removeAccents = (str) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    var cadena = removeAccents(this.nombre_cv);
    this.nombre_cv = cadena

    this.cvHash = Math.random().toString(36).substring(2);
    if (this.nombre_cv) {
      // iterar cada uno de los atributos
      this.arregloAtributos.forEach((atributo) => {
        // para eficiencia se puede comprobar si el registro actual (bloque)
        // se ha modificado. Si sus campos son iguales al original entonces
        // no es necesario guardarlo
        this.arregloBloques.forEach((bloque) => {

          if (atributo.bloque === bloque.nombre) {
            console.log("SON IGUALES", atributo.bloque, bloque.nombre, atributo.ordenCompleto)
            const data = {
              id_user: iduser,
              bloque: atributo.bloque,
              atributo: atributo.atributo,
              orden: atributo.ordenCompleto,
              visible_cv_personalizado: atributo.visible_cv_completo,
              mapeo: atributo.mapeo,
              cv: this.cvHash,
              nombre_cv: this.nombre_cv,
              fecha_registro: now,
              cedula: this.docente.cedula,
              ordenPersonalizable: bloque.ordenPersonalizable,
              visible_cv_bloque: bloque.visible_cv_bloqueCompleto
            }
            this.miDataInterior.push(data);
          }
        });
      });

      for (let i = 0; i < this.miDataInterior.length; i++) {
        let clave = this.miDataInterior[i];
        this.configuracioncvService.postConfiguracionPersonalizada(clave)
          .subscribe(res => {

          });
        this._snackBar.open('CV Personalizado Guardado Correctamente', "Cerrar", {
          duration: 3000,
        });
      }
      this.miDataInterior = []
      //Variables para habilitar botones de guardar e ingreso 
      this.isDisabled = false;

    } else {
      console.log("NOMBRECVESTANULO", this.nombre_cv)
      this._snackBar.open('Por favor ingresa el nombre del cv personalizado', "Cerrar", {
        duration: 3000,
      });
    }
  }

  guardarBloquesAtributos() {
    this.guardar();
    this.guardarAtributos();
    localStorage.setItem('nombre_cv', this.nombre_cv);
  }


  nombrecvLocalStorage() {
    localStorage.setItem('nombre_cv', this.nombre_cv);
  }

  informacionDocente() {
    let iduser = localStorage.getItem("id_user");
    this.infoDocenteService.getInfoDocente(iduser).subscribe((res) => {
      this.docente = res;
    })
  }

}
