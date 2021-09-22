import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfiguracioncvService } from "app/services/configuracioncv.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { PersonalizadoCvComponent } from '../personalizado-cv/personalizado-cv.component';


@Component({
  selector: 'app-creacv-personalizado',
  templateUrl: './creacv-personalizado.component.html',
  styleUrls: ['./creacv-personalizado.component.css']
})
export class CreacvPersonalizadoComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PersonalizadoCvComponent) child:PersonalizadoCvComponent;
  

  nombreBloque;
  arregloBloques = [];
  arregloAtributosOriginal = []
  atributosOrdenados;
  atributosOriginal;
  // displayedColumns: string[] = ['visible_cv_bloque', 'nombre', 'ordenCompleto', 'ingreso'];
  displayedColumns: string[] = ['visible_cv_completo', 'atributo', 'orden', 'mapeo'];

  dataSource;
  parentSelector: boolean = false;
  id;
  miDataInterior = [];
  nombre_cv: string;
  id_user;


  constructor(
    private route: ActivatedRoute,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.nombreBloque = this.route.snapshot.params["nombre"];
    this.nombre_cv = this.route.snapshot.params["nombre_cv"];
    this.getConfiguracion();
    this.getConfiguracionPersonalizada();
    // console.log("this.child.nombre_cv--->>>>>>>", this.child.nombre_cv)
    console.log(Math.random().toString(36).substring(2));
    
    console.log("NOMBRECVAAA->>>>", localStorage.getItem('nombre_cv'));
    this.nombre_cv =  localStorage.getItem('nombre_cv');
    this.id_user =  localStorage.getItem('id_user');
  }

  // ngAfterViewInit() {
  //   this.nombre_cv = this.child.nombre_cv
  //   console.log(this.nombre_cv)
  // }

  getConfiguracion() {
    this.configuracioncvService.getConfiguraciones().subscribe(
      (res) => {
        this.configuracioncvService.configuraciones = res;
        const filteredCategories = [];
        res.forEach((configuracion) => {
          if (!filteredCategories.find((cat) =>
                cat.bloque == configuracion.bloque &&
                cat.atributo == configuracion.atributo)
          ) {
            const {
              id,
              bloque,
              atributo,
              orden,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            } = configuracion;
            filteredCategories.push({
              id,
              bloque,
              atributo,
              orden,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            });
          }
        });

        this.configuracioncvService.configuraciones = filteredCategories;
        // console.log("TODOSLOSBLOQUES-->>>>>>>", filteredCategories);
        this.arregloBloques = filteredCategories.filter((user) => user.bloque === this.nombreBloque);
        this.atributosOrdenados = _.orderBy(this.arregloBloques, ["orden", "atributo"],["asc", "asc"]);
        this.arregloBloques = this.atributosOrdenados;

        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        console.log("FILTRADOBLOQUE", this.arregloBloques);
        this.atributosOriginal = JSON.parse(
          JSON.stringify(filteredCategories)
        );
        console.log("ATRIBUTOSIRIGINAL", this.atributosOriginal)
      },
      (err) => console.log(err)
    );
  }

  getConfiguracionPersonalizada(){
    this.configuracioncvService.getConfiguracionesPersonalizadas().subscribe( res =>{
      
      // this.arregloAtributosOriginal = res.filter((atributo) => atributo.id_user === this.id_user && atributo.nombre_cv === this.nombre_cv);
      console.log("CONFPERSONALIZADAS", res)
      this.arregloAtributosOriginal = JSON.parse(
        JSON.stringify(res)
      );

    })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // onChangeBloque($event) {
  //   const id = $event.target.value;
  //   const isChecked = $event.target.checked;

  //   this.arregloBloques = this.arregloBloques.map((d) => {
  //     if (d.id == id) {
  //       d.visible_cv_bloque = isChecked;
  //       this.parentSelector = false;
  //       return d;
  //     }
  //     if (id == -1) {
  //       d.visible_cv_bloque = this.parentSelector;
  //       return d;
  //     }
  //     return d;
  //   });
  //   console.log("food", this.arregloBloques);
  // }

  valor(id){
    this.id = id
    console.log('id', this.id)
  }


  onChangeAtributo($event) {
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.arregloBloques = this.arregloBloques.map((d) => {
      if (d.id == id) {
        d.visible_cv_completo = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.visible_cv_completo = this.parentSelector;
        return d;
      }
      return d;
    });
    console.log("food", this.arregloBloques);
  }


  guardar() {
    // iterar cada uno de los bloques
    let iduser =  localStorage.getItem("id_user");
    console.log("arregloBloques",this.arregloBloques)
    this.arregloBloques.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      // console.log("atributo", atributo)
      let hash = Math.random().toString(36).substring(2);
      const data = {
        // configuracionId: 1,
        id_atributo : atributo.id,
        id_user: iduser,
        bloque: atributo.bloque,
        atributo: atributo.atributo,
        orden: atributo.orden,
        visible_cv_personalizado: atributo.visible_cv_completo,
        mapeo: atributo.mapeo,
        cv: hash,
        nombre_cv: this.nombre_cv,
        cedula: "123"
      }

      this.miDataInterior.push(data);
      console.log("configurac", this.miDataInterior);
      

     
      // let atribtutoOriginal = this.arregloAtributos.find((b) => b.nombre_cv == atributo.nombre_cv && b.cedula === atributo.cedula);
      // console.log("ATRIBUTOORIGINAL", atribtutoOriginal)
      // if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo && atribtutoOriginal.visible_cv_completo == atributo.visible_cv_completo) return;

      // si el bloque se modificó proceder a guardarlo

      
      // console.log("AASDAS SEGUARDA-->>>>>>>>>>>>>>>>>......")
      // this.configuracioncvService
      //   .putConfiguracion(atributo)
      //   .subscribe((res) => {
      //     console.log("editado", res);
      //     this._snackBar.open("Se guardó  correctamente", "Cerrar", {
      //       duration: 2000,
      //     });
      //     this.getConfiguracion();
      //   });
    });

    
    console.log("ATRIBUTOSORIGINAL", this.arregloAtributosOriginal)
    this.guardarAtr();

    // console.log("DATAINTERIOR", this.miDataInterior)
    // for (let i = 0; i < this.miDataInterior.length; i++) {
    //   let clave = this.miDataInterior[i];
    //   console.log('CLAVE', clave)
    //   this.configuracioncvService.postConfiguracionPersonalizada(clave)
    //     .subscribe(res => {
         
    //       console.log('SEGUARDO', res)
    //     });
    //     this._snackBar.open('Guardado Correctamente', "Cerrar", {
    //       duration: 2000,
    //     });
    // }
    
  }

  

  guardarAtr(){
    //  comparar este que es el registro actual
   
    console.log("miDataInterior", this.miDataInterior)
    console.log("ARREGLOSATRORIGINAL", this.arregloAtributosOriginal)
    this.miDataInterior.forEach((atributo) => {
      console.log("atributo", atributo.id_atributo);
      let atribtutoOriginal = this.arregloAtributosOriginal.find((b) => b.id_atributo == atributo.id_atributo);
      console.log("ATRORIGINAL--->>>>>>>>", atribtutoOriginal);
      if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo && atribtutoOriginal.visible_cv_completo == atributo.visible_cv_completo) return;
      console.log("SE GUARDA");
    });

    this.miDataInterior = [] 
    console.log("miDataInterior", this.miDataInterior)
  }

  guardarAtributos() {
    // iterar cada uno de los bloques
    let iduser =  localStorage.getItem("id_user");
    
    console.log("AAA->>>>arregloBloques",this.arregloAtributosOriginal)
    this.arregloAtributosOriginal.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      console.log("atributo", atributo)
      let hash = Math.random().toString(36).substring(2);
      const data = {
        // configuracionId: 1,
        id_user: iduser,
        bloque: atributo.bloque,
        atributo: atributo.atributo,
        orden: atributo.orden,
        visible_cv_personalizado: atributo.visible_cv_completo,
        mapeo: atributo.mapeo,
        cv: hash,
        nombre_cv: this.nombre_cv,
        cedula: "123"
      }

      this.miDataInterior.push(data);
      console.log("configurac", this.miDataInterior);
      

     
      // let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      // if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo && atribtutoOriginal.visible_cv_completo == atributo.visible_cv_completo) return;

      // si el bloque se modificó proceder a guardarlo

      // console.log("AASDAS")
      // this.configuracioncvService
      //   .putConfiguracion(atributo)
      //   .subscribe((res) => {
      //     console.log("editado", res);
      //     this._snackBar.open("Se guardó  correctamente", "Cerrar", {
      //       duration: 2000,
      //     });
      //     this.getConfiguracion();
      //   });
    });
    // console.log("DATAINTERIOR", this.miDataInterior)
    for (let i = 0; i < this.miDataInterior.length; i++) {
      let clave = this.miDataInterior[i];
      console.log('CLAVE', clave)
      this.configuracioncvService.postConfiguracionPersonalizada(clave)
        .subscribe(res => {
         
          console.log('SEGUARDO', res)
        });
        this._snackBar.open('Guardado Correctamente', "Cerrar", {
          duration: 2000,
        });
    }
    this.miDataInterior = [] 
  }

}
