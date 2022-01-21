import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { ConfiguracioncvService } from "app/services/configuracioncv.service";
import { Subject } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "lodash";
import { Configuracioncv } from "app/models/configuracioncv.model";
import { ConfiguracioncvPersonalizado } from "app/models/configuracioncvPersonalizado.model";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: "app-edita-personalizado",
  templateUrl: "./edita-personalizado.component.html",
  styleUrls: ["./edita-personalizado.component.css"],
})
export class EditaPersonalizadoComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['visible_cv_bloque', 'bloque', 'ordenPersonalizable', 'ingreso'];
  dataSource;

  formPersonalizado: FormGroup;
  nombre_cv;
  nombre_cvNuevo;
  cvHash;
  private _unsubscribeAll: Subject<any>;
  configuraciones: Configuracioncv[];
  configuracionesPersonalizadas: ConfiguracioncvPersonalizado[];
  configuracionesClas: any;
  atributosOriginal;
  miDataInterior = [];
  confPersonalizadaNombre = [];
  filtradoBloques = [];
  arregloBloques = [];
  bloquesOrdenArreglo = [];
  idUsuario;
  parentSelector: boolean = false;
  id;

  arregloBloquesVisibles = [];
  arregloBloquesNoVisibles = []

  constructor(
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.cvHash = this.route.snapshot.params["cv"];
    this.nombre_cv = this.route.snapshot.params["nombre"];
    this.nombre_cvNuevo = this.nombre_cv;
    console.log("NOMBRESCVSINIT", this.nombre_cv, this.nombre_cvNuevo)
    this.idUsuario = (localStorage.getItem('id_user'));
    console.log("IDUSARIO", this.idUsuario)

    // this.getConfiguracionesPersonalizadas()
    this.setIntrvl()
  }


  setIntrvl() {
    // setTimeout(() => this.compararArregloAtributos(), 6000);
    setTimeout(() => this.getConfiguracionesPersonalizadas(), 800);
  }

  getConfiguracionesPersonalizadas() {
    console.log("NOMBRECVGET", this.nombre_cvNuevo)
    this.nombre_cv = this.nombre_cvNuevo
    let iduser = localStorage.getItem("id_user");


    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser).subscribe(configuracionesPersonalizadas => {
      // console.log("configuracionesPersonalizadas", configuracionesPersonalizadas)
      // this.filtradoBloques = configuracionesPersonalizadas;

      this.filtradoBloques = configuracionesPersonalizadas.filter((cvpersonalizado) =>
        cvpersonalizado.nombre_cv === this.nombre_cvNuevo
        && cvpersonalizado.cv === this.cvHash);
      // console.log("🚀 ~ file: edita-personalizado.component.ts ~ line 124 ~ EditaPersonalizadoComponent ~ this.configuracioncvService.listaConfiguracionPersonalizadaDocente ~ this.filtradoBloques", this.filtradoBloques)

      this.confPersonalizadaNombre = this.filtradoBloques;

      console.log("ATRIBUTOSIRIGINALMETODOGUARDAR", this.confPersonalizadaNombre)

      // console.log("confPersonalizadaNombre", this.confPersonalizadaNombre)
      let i = 1;
      this.filtradoBloques.forEach((bloque) => {
        // console.log("BLOQUE", bloque)
        const data = {
          id: i++,
          bloque: bloque.bloque,
          ordenPersonalizable: bloque.ordenPersonalizable,
          visible_cv_bloque: bloque.visible_cv_bloque
        }
        this.arregloBloques.push(data)
      });
      this.arregloBloques = _.uniqBy(this.arregloBloques, 'bloque');
      let bloquesOrdenados = _.orderBy(this.arregloBloques, ['ordenPersonalizable',], ['asc']);
      this.arregloBloques = bloquesOrdenados;
      this.arregloBloquesNoVisibles = bloquesOrdenados;
      this.arregloBloquesVisibles = bloquesOrdenados;

      this.dataSource = new MatTableDataSource(this.arregloBloques);
      this.dataSource.paginator = this.paginator;
      this.atributosOriginal = JSON.parse(
        JSON.stringify(this.arregloBloques)
      );
      console.log("ARREGLOBLOQUESSERVICE", this.arregloBloques)
    });
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    this.dataSource = new MatTableDataSource(this.arregloBloques);
  }


  FiltroNoVisibles() {
    //Si checkbox es true muestra bloques visibles caso contrario muestra todos los bloques
    // console.log(event.checked)
    // if (event.checked) {
    console.log("FILTRONOVISBLES", this.confPersonalizadaNombre);
    let atributosOrdenados = _.filter(this.arregloBloquesVisibles, ['visible_cv_bloque', false]);
    this.arregloBloques = atributosOrdenados;
    this.dataSource = new MatTableDataSource(this.arregloBloques);
    this.atributosOriginal = JSON.parse(
      JSON.stringify(this.arregloBloques)
    );
    console.log("NOVISIBLESBLOQUESPERS-->>", this.atributosOriginal)
  }

  FiltroVisibles() {
    //Si checkbox es true muestra bloques visibles caso contrario muestra todos los bloques
    // console.log(event.checked)
    // if (event.checked) {
    console.log("FILTROVISBLES", this.confPersonalizadaNombre);
    let atributosOrdenados = _.filter(this.arregloBloquesNoVisibles, ['visible_cv_bloque', true]);
    this.arregloBloques = atributosOrdenados;
    this.dataSource = new MatTableDataSource(this.arregloBloques);
    this.atributosOriginal = JSON.parse(
      JSON.stringify(this.arregloBloques)
    );
    console.log("VISIBLESBLOQUESPERS-->>", this.atributosOriginal)
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
        d.visible_cv_bloque = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.visible_cv_bloque = this.parentSelector;
        return d;
      }
      return d;
    });
    console.log("food", this.arregloBloques);
  }





  guardarAtributos() {
    // iterar cada uno de los bloques
    let iduser = localStorage.getItem("id_user");

    console.log("NOVISIBLESFILTER", this.arregloBloques)

    console.log("NOMBRECV", this.nombre_cv)
    console.log("NOMBRECVNUEVO", this.nombre_cvNuevo)
    console.log("ARREGLOBLOQUESGUARDAR", this.arregloBloques)

    this.nombre_cvNuevo = this.nombre_cvNuevo.replace(/=|\?|\+|#|_| |\/|'|"|\(|\)|&|\*|\$|`|~|@|%|\||\\|<|>|{|}|\[|\]|\.|\,|\^|\;|\:|!|¡|º|ª/g, '')

    console.log("nombre_cv", this.nombre_cvNuevo)

    const removeAccents = (str) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    // let nombre_cv = 'campeón'
    var cadena = removeAccents(this.nombre_cvNuevo);
    console.log(cadena); 

    this.nombre_cvNuevo = cadena

    this.confPersonalizadaNombre.forEach((atributo) => {
      let hash = Math.random().toString(36).substring(2);

      // Recorre configuracion personalizadas traidas desde el servicio
      this.arregloBloques.forEach((bloque) => {
        // console.log("BLOQUE", bloque)

        if (atributo.bloque === bloque.bloque) {
          // console.log("SON IGUALES")
          const data = {
            id: atributo.id,
            id_user: iduser,
            bloque: atributo.bloque,
            atributo: atributo.atributo,
            orden: atributo.orden,
            visible_cv_personalizado: atributo.visible_cv_personalizado,
            mapeo: atributo.mapeo,
            cv: atributo.cv,
            nombre_cv: this.nombre_cvNuevo,
            cedula: atributo.id,
            nombreBloque: bloque.bloque,
            ordenPersonalizable: bloque.ordenPersonalizable, //Orden de bloque Personalizable
            visible_cv_bloque: bloque.visible_cv_bloque
          }
          this.miDataInterior.push(data);
        }
      });
    });


    this.configuracioncvService.getConfiguracionesPersonalizadas().subscribe((configuracionesPersonalizadas) => {
      console.log("CONFPERSONALIZADAS", configuracionesPersonalizadas )
      this.filtradoBloques = configuracionesPersonalizadas.filter((user) => user.id_user === this.idUsuario
        && user.nombre_cv === this.nombre_cv);

      this.atributosOriginal = this.filtradoBloques;
      console.log("DATAORIGINALNOMBRE", this.atributosOriginal)
      console.log("GUARDARDATAINTERIOR", this.miDataInterior)

      console.log("NOMBRECVNUEVO", this.nombre_cvNuevo)
      // iterar cada uno de los bloques
      this.miDataInterior.forEach((confPersonalizada) => {

        // para eficiencia se puede comprobar si el registro actual (bloque)
        // se ha modificado. Si sus campos son iguales al original entonces
        // no es necesario guardarlo
        // console.log("ATRORIGINAL",this.atributosOriginal)
        let confPersonalizadaOriginal = this.atributosOriginal.find(confOriginal => confOriginal.id == confPersonalizada.id)
        console.log("NOMBRESCV", confPersonalizada.nombre_cv, this.nombre_cv)
        if (this.nombre_cvNuevo == confPersonalizadaOriginal.nombre_cv
          && confPersonalizadaOriginal.ordenPersonalizable
          == confPersonalizada.ordenPersonalizable
          && confPersonalizadaOriginal.visible_cv_bloque
          == confPersonalizada.visible_cv_bloque)
          return

        // si el bloque se modificó proceder a guardarlo
        this.configuracioncvService.putConfiguracionPersonalizada(confPersonalizada).subscribe((res) => {
          console.log("editado", res);
          this.getConfiguracionesPersonalizadas();

        });
        this._snackBar.open("Se editó la configuración correctamente", "Cerrar", {
          duration: 2000,
        });
      });

      // console.log("ATRIBUTOSORIGONALGUARDADO", this.atributosOriginal)

      this.miDataInterior = []

    });
  }

  guardarBloquesAtributos() {
    this.guardarAtributos();
    // this.guardar();
    localStorage.setItem('nombre_cv', this.nombre_cv);
  }

  nombrecvLocalStorage() {
    localStorage.setItem('nombre_cv', this.nombre_cv);
  }


}
