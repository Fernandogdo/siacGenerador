import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import { ConfiguracioncvService } from "app/services/configuracioncv.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "lodash";
import { Configuracioncv } from "app/models/configuracioncv.model";
import { ConfiguracioncvPersonalizado } from "app/models/configuracioncvPersonalizado.model";
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: "app-edita-personalizado",
  templateUrl: "./edita-personalizado.component.html",
  styleUrls: ["./edita-personalizado.component.css"],
})
export class EditaPersonalizadoComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['visible_cv_bloque', 'bloque', 'ordenPersonalizable', 'ingreso'];
  dataSource;

  formPersonalizado: FormGroup;
  nombre_cv;
  private _unsubscribeAll: Subject<any>;
  configuraciones: Configuracioncv[];
  configuracionesPersonalizadas: ConfiguracioncvPersonalizado[];
  configuracionesClas: any;
  atributosOriginal;
  miDataInterior = [];
  confPersonalizadaNombre = [];
  filtradoBloques =[];
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
    this.nombre_cv = this.route.snapshot.params["nombre"];
    this.idUsuario =   parseInt(localStorage.getItem('id_user'));
    // console.log("NOMBREBLOQUE", this.nombre_cv);
    this.configuracioncvService.onConfiguracionesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((configuraciones) => {
        this.configuraciones = configuraciones;
        this.configuracionesClas = _.groupBy(configuraciones, "bloque");
      });
    // this.configuracioncvService.onConfigPersonalizadasChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((configuracionesPersonalizadas) => {
    //     this.configuracionesPersonalizadas = configuracionesPersonalizadas;
    //     this.filtradoBloques = this.configuracionesPersonalizadas.filter((user) =>  user.id_user === this.idUsuario 
    //     && user.nombre_cv === this.nombre_cv);
        
    //     this.filtradoBloques.forEach((bloque)=> {
    //       const data = {
    //         bloque: bloque.bloque,
    //         ordenPersonalizable: bloque.ordenPersonalizable,
    //         visible_cv_personalizado: bloque.visible_cv_personalizado
    //       }
    //       this.arregloBloques.push(data)
    //     });

       
    //     console.log("ARREGLOBLOQUES", _.uniqBy(this.arregloBloques, 'bloque'));
    //     // console.log("RESULTRESULT",this.arregloBloques); //[1,2,6,5,9,'33']data
    //   });
    // this.formPersonalizado = this.addPropiedades();

    // this.getBloques();
    this.getConfiguracionesPersonalizadas()
    // this.nombre_cv = localStorage.getItem('nombre_cv');
  }



  // getBloques() {
  //   this.configuracioncvService.getBloques()
  //     .subscribe(res => {
  //       this.arregloBloques = res
  //       let atributosOrdenados = _.orderBy(this.arregloBloques,['ordenPersonalizable', ], ['asc'])
  //       this.arregloBloques = atributosOrdenados
  //       console.log("BLOQUESORDENADOS", this.arregloBloques)
  //       this.dataSource = new MatTableDataSource(this.arregloBloques);
  //       // this.selection = new SelectionModel<Bloque>(true, []);
  //       this.dataSource.paginator = this.paginator;
  //       // this.bloquesOriginal = JSON.parse(
  //       //   JSON.stringify(this.arregloBloques)
  //       // );      
  //     });
  // }


  getConfiguracionesPersonalizadas(){
    this.configuracioncvService.getConfiguracionesPersonalizadas().subscribe( (configuracionesPersonalizadas) =>{
      this.filtradoBloques = configuracionesPersonalizadas.filter((user) =>  user.id_user === this.idUsuario 
       && user.nombre_cv === this.nombre_cv);

      this.confPersonalizadaNombre = this.filtradoBloques;
      // this.atributosOriginal = this.confPersonalizadaNombre
      
      // JSON.parse(
      //   JSON.stringify(this.confPersonalizadaNombre)
      // );
      console.log("ATRIBUTOSIRIGINALMETODOGUARDAR", this.confPersonalizadaNombre)

      // console.log("confPersonalizadaNombre", this.confPersonalizadaNombre)
      let i = 1
      ;
      this.filtradoBloques.forEach((bloque)=> {
            // console.log("BLOQUE", bloque)
             const data = {
               id:i++,
               bloque: bloque.bloque,
               ordenPersonalizable: bloque.ordenPersonalizable,
               visible_cv_bloque: bloque.visible_cv_bloque
             }
             this.arregloBloques.push(data)
       });
       this.arregloBloques = _.uniqBy(this.arregloBloques, 'bloque');
       let bloquesOrdenados = _.orderBy(this.arregloBloques,['ordenPersonalizable', ], ['asc']);
       this.arregloBloques = bloquesOrdenados;
       this.arregloBloquesNoVisibles = bloquesOrdenados;  
       this.arregloBloquesVisibles = bloquesOrdenados;  

       this.dataSource = new MatTableDataSource(this.arregloBloques);
       this.dataSource.paginator = this.paginator;
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
      let atributosOrdenados = _.filter(this.arregloBloquesVisibles,['visible_cv_bloque', false ]);
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
      console.log("FILTRONOVISBLES", this.confPersonalizadaNombre);
      let atributosOrdenados = _.filter(this.arregloBloquesNoVisibles,['visible_cv_bloque', true ]);
      this.arregloBloques = atributosOrdenados;
      this.dataSource = new MatTableDataSource(this.arregloBloques);
      this.atributosOriginal = JSON.parse(
        JSON.stringify(this.arregloBloques)
      );
      console.log("VISIBLESBLOQUESPERS-->>", this.atributosOriginal)
  }

  valor(id){
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
    let iduser =  localStorage.getItem("id_user");

    console.log("NOVISIBLESFILTER", this.arregloBloques)
    
    console.log("NOMBRECV", this.nombre_cv)
    console.log("ARREGLOBLOQUESGUARDAR", this.arregloBloques)
    
    this.confPersonalizadaNombre.forEach((atributo) => {
      let hash = Math.random().toString(36).substring(2);

      // Recorre configuracion personalizadas traidas desde el servicio
      this.arregloBloques.forEach((bloque)=> {
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
            nombre_cv: this.nombre_cv,
            cedula: atributo.id,
            nombreBloque: bloque.bloque,
            ordenPersonalizable: bloque.ordenPersonalizable, //Orden de bloque Personalizable
            visible_cv_bloque: bloque.visible_cv_bloque
          }
          this.miDataInterior.push(data);
        } 
      });      
    });

  
    this.configuracioncvService.getConfiguracionesPersonalizadas().subscribe( (configuracionesPersonalizadas) =>{
      this.filtradoBloques = configuracionesPersonalizadas.filter((user) =>  user.id_user === this.idUsuario 
       && user.nombre_cv === this.nombre_cv);

          this.atributosOriginal = this.filtradoBloques;
          console.log("DATAORIGINALNOMBRE", this.atributosOriginal)
          console.log("GUARDARDATAINTERIOR", this.miDataInterior)

      // iterar cada uno de los bloques
      this.miDataInterior.forEach((confPersonalizada) => {

        // para eficiencia se puede comprobar si el registro actual (bloque)
        // se ha modificado. Si sus campos son iguales al original entonces
        // no es necesario guardarlo
        // console.log("ATRORIGINAL",this.atributosOriginal)
        let confPersonalizadaOriginal = this.atributosOriginal.find(confOriginal=> confOriginal.id == confPersonalizada.id)
        if(confPersonalizada.nombre_cv == confPersonalizadaOriginal.nombre_cv  
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

  // guardar() {
  //   console.log("GUARDARDATAINTERIOR", this.miDataInterior)

  //   // iterar cada uno de los bloques
  //   this.miDataInterior.forEach((confPersonalizada) => {

  //     // para eficiencia se puede comprobar si el registro actual (bloque)
  //     // se ha modificado. Si sus campos son iguales al original entonces
  //     // no es necesario guardarlo
  //     console.log(confPersonalizada)
  //     let confPersonalizadaOriginal = this.atributosOriginal.find(confOriginal=> confOriginal.id == confPersonalizada.id)
  //     if(confPersonalizadaOriginal.ordenPersonalizable == confPersonalizada.ordenPersonalizable && 
  //       confPersonalizadaOriginal.visible_cv_bloque == confPersonalizada.visible_cv_bloque) return

  //       console.log("guardado")
  //     // si el bloque se modificó proceder a guardarlo
  //     // this.configuracioncvService.putBloque(bloque).subscribe((res) => {
  //     //     console.log("editado", res);
  //     //     // this.getBloques();
  //     //   });
  //     //   this._snackBar.open("Se guardó correctamente", "Cerrar", {
  //     //     duration: 2000,
  //     //   });
  //   });
  // }

  guardarBloquesAtributos(){
    this.guardarAtributos();
    // this.guardar();
    localStorage.setItem('nombre_cv', this.nombre_cv);
  } 

  nombrecvLocalStorage(){
    localStorage.setItem('nombre_cv', this.nombre_cv);
  }
  
  // addPropiedades() {
  //   const group = {};
  //   group["nombre_cv"] = new FormControl(this.nombre_cv, Validators.required);

  //   this.confPersonalizadaNombre = this.configuracionesPersonalizadas.filter(
  //     (data) => data.nombre_cv === this.nombre_cv
  //   );
  //   console.log("filtradonombre", this.confPersonalizadaNombre);

  //   this.configuraciones.forEach((arreglo: any, index) => {
  //     const seleccionado = this.confPersonalizadaNombre.find(
  //       (c) => c.configuracionId === arreglo.id
  //     );

  //     group[arreglo.id] = this.fb.group({
  //       valor: [seleccionado ? true : false],
  //       orden: [1],
  //       // bloque: bloque
  //     });
  //   });
  //   return new FormGroup(group);
  // }

  // guardar() {
  //   const form = this.formPersonalizado.getRawValue();
  //   console.log("FORM", form);
  //   const resultados = [];
  //   _.map(form, (element, key) => {
  //     if (element.valor !== false && key !== "nombre_cv") {
  //       // delete element.valor;
  //       resultados.push({
  //         configuracionId: key,
  //         // ...element,
  //         nombre_cv: this.nombre_cv,
  //         visible_cv_personalizado: element.valor,
  //       });
  //     }
  //   });
  //   console.log(
  //     "🚀 ~ file: edita-personalizado.component.ts ~ line 97 ~ EditaPersonalizadoComponent ~ guardar ~ resultados",
  //     resultados
  //   );
  //   this.postConfiguracionPersonalizada(resultados);
  // }

  postConfiguracionPersonalizada(resultados) {
    const promesas = [];
    const data = [
      {
        configuracionId: 1,
        nombre_cv: "data",
        visible_cv_personalizado: true
      },
      {
        configuracionId: 3,
        id: 1,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: false,
      },

      {
        configuracionId: 5,
        id: 2,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      {
        configuracionId: 7,
        id: 3,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      {
        configuracionId: 9,
        id: 5,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      {
        configuracionId: 11,
        id: 6,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      {
        configuracionId: 13,
        id: 7,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      // {configuracionId: 3, id: 2,
      // idDocente: 1, nombre_cv: "data", orden: 1,
      // visible_cv_personalizado: true}
    ];
    var iguales = 0;
    for (let i = 0; i < resultados; i++) {
      console.log(
        "🚀 ~ file: edita-personalizado.component.ts ~ line 98 ~ EditaPersonalizadoComponent ~ postConfiguracionPersonalizada ~ clave",
        iguales
      );

      // this.configuracioncvService
      //   .putConfiguracionPersonalizada(clave)
      //   .subscribe((res) => {
      //     console.log("SEEDITA", res);
      //   });
      // promesas.push(this.configuracioncvService
      //   .postConfiguracionPersonalizada(clave));
    }
    return Promise.all(promesas);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
