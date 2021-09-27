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
  arregloAtributos = []
  atributosOrdenados;
  atributosOriginal;
  // displayedColumns: string[] = ['visible_cv_bloque', 'nombre', 'ordenCompleto', 'ingreso'];
  displayedColumns: string[] = ['visible_cv_personalizado', 'atributo', 'orden', 'mapeo'];

  dataSource;
  parentSelector: boolean = false;
  id;
  miDataInterior = [];
  nombre_cv: string;
  idUsuario;


  constructor(
    private route: ActivatedRoute,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.nombreBloque = this.route.snapshot.params["nombre"];
    this.nombre_cv = this.route.snapshot.params["nombre_cv"];
    // this.getConfiguracion();
    this.getConfiguracionPersonalizada();
    // console.log("this.child.nombre_cv--->>>>>>>", this.child.nombre_cv)
    // console.log(Math.random().toString(36).substring(2));
    
    // console.log("NOMBRECVAAA->>>>", localStorage.getItem('nombre_cv'));
    // this.nombre_cv =  localStorage.getItem('nombre_cv');
    this.idUsuario =   parseInt(localStorage.getItem('id_user'));
    // console.log("IDUSUARIO", parseInt(localStorage.getItem('id_user')));
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
    this.configuracioncvService.getConfiguracionesPersonalizadas().subscribe( (res) =>{
      this.configuracioncvService.configuracionesPersonalizadas = res;
      console.log("RESORIGINAL", res)
      console.log("RESRESFILTRADA-->>>>>>", res.filter((user) =>  user.id_user === this.idUsuario 
      && user.bloque === this.nombreBloque && user.nombre_cv === this.nombre_cv));
      const filteredCategories = [];
        res.forEach((configuracion) => {
          if (!filteredCategories.find((cat) =>
                cat.bloque == configuracion.bloque &&
                cat.nombre_cv == configuracion.nombre_cv &&
                cat.atributo == configuracion.atributo
                )
          ) {
            const {
              id,
              bloque,
              atributo,
              orden,
              visible_cv_personalizado,
              mapeo,
              cv,
              nombre_cv,
              fecha_registro,
              cedula,
              id_user
            } = configuracion;
            filteredCategories.push({
              id,
              bloque,
              atributo,
              orden,
              visible_cv_personalizado,
              mapeo,
              cv,
              nombre_cv,
              fecha_registro,
              cedula,
              id_user
            });
          }
        });
      this.configuracioncvService.configuracionesPersonalizadas = filteredCategories;
      // const filtradoNOmbre = filteredCategories.filter((atributo)=>  atributo.id_user === this.idUsuario)
      console.log("FILTEREDCATEGORIES-->>>>", filteredCategories)
      
      this.arregloAtributos = filteredCategories.filter((user) =>  user.id_user === this.idUsuario 
        && user.bloque === this.nombreBloque && user.nombre_cv === this.nombre_cv);

      console.log("PERSONALIZADASPERSONALIZADAS", this.arregloAtributos)
      this.atributosOrdenados = _.orderBy(this.arregloAtributos, ["orden", "atributo"],["asc", "asc"]);
      this.arregloAtributos = this.atributosOrdenados;

      this.dataSource = new MatTableDataSource(this.arregloAtributos);
      this.dataSource.paginator = this.paginator;

      this.atributosOriginal = JSON.parse(
        JSON.stringify(res)
      );

    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  valor(id){
    this.id = id
    console.log('id', this.id)
  }


  onChangeAtributo($event) {
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.arregloAtributos = this.arregloAtributos.map((d) => {
      if (d.id == id) {
        d.visible_cv_personalizado = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.visible_cv_personalizado = this.parentSelector;
        return d;
      }
      return d;
    });
    console.log("food", this.arregloAtributos);
  }


  guardar() {
    // iterar cada uno de los bloques
    let iduser =  localStorage.getItem("id_user");
    console.log("arregloBloques",this.arregloAtributos)
    this.arregloAtributos.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (atributo)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      // console.log("atributo", atributo)
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      console.log("ATRIBUTOORIGINAL", atribtutoOriginal)
      if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo && atribtutoOriginal.visible_cv_personalizado == atributo.visible_cv_personalizado) return;

      // si el bloque se modificó proceder a guardarlo

      
      console.log("AASDAS SEGUARDA-->>>>>>>>>>>>>>>>>......")
      this.configuracioncvService
        .putConfiguracionPersonalizada(atributo)
        .subscribe((res) => {
          console.log("editado", res);
          this._snackBar.open("Se guardó  correctamente", "Cerrar", {
            duration: 2000,
          });
          this.getConfiguracionPersonalizada();
        });
    });

    
    console.log("ATRIBUTOSORIGINAL", this.arregloAtributos)
    
  }

 

  

  // guardarAtr(){   
  //   console.log("miDataInterior", this.miDataInterior)
  //   console.log("ARREGLOSATRORIGINAL", this.arregloAtributos)
  //   this.miDataInterior.forEach((atributo) => {
  //     console.log("atributo", atributo.id_atributo);
  //     let atribtutoOriginal = this.arregloAtributos.find((b) => b.id_atributo == atributo.id_atributo);
  //     console.log("ATRORIGINAL--->>>>>>>>", atribtutoOriginal);
  //     if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo && atribtutoOriginal.visible_cv_completo == atributo.visible_cv_completo) return;
  //     console.log("SE GUARDA");
  //   });

  //   this.miDataInterior = [] 
  //   console.log("miDataInterior", this.miDataInterior)
  // }

}
