import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Params, Router } from "@angular/router";
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfiguracioncvService } from "../../services/configuracioncv.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { PersonalizadoCvComponent } from '../personalizado-cv/personalizado-cv.component';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

// NavigationStart
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
  displayedColumns: string[] = ['visible_cv_personalizado', 'mapeo', 'orden'];

  dataSource;
  parentSelector: boolean = false;
  id;
  miDataInterior = [];
  nombre_cv: string;
  cvHash;
  idUsuario;
  confPersoDocente;
  alertaCambios: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar,
    // private spinnerService: Ng4LoadingSpinnerService
  ) { 
    this.NoBackNavigator()
  }

  ngOnInit(): void {
    this.cvHash = this.route.snapshot.params["cv"];
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

  NoBackNavigator() {
    // window.location.hash="no-back-button";
    // window.location.hash="Again-No-back-button";//esta linea es necesaria para chrome
    // window.onhashchange=function(){window.location.hash="no-back-button";}
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function (event)
    {
      history.pushState(null, document.title, location.href);
    });
  }

  getConfiguracion() {
    this.configuracioncvService.getConfiguraciones().subscribe(
      (res) => {
        this.configuracioncvService.configuraciones = res;
        
        this.arregloBloques = res.filter((user) => user.bloque === this.nombreBloque);
        this.atributosOrdenados = _.orderBy(this.arregloBloques, ["ordenCompleto", "atributo"],["asc", "asc"]);
        this.arregloBloques = this.atributosOrdenados;

        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        console.log("FILTRADOBLOQUE", this.arregloBloques);
        this.atributosOriginal = JSON.parse(
          JSON.stringify(res)
        );
        console.log("ATRIBUTOSIRIGINAL", this.atributosOriginal)
      },
      (err) => console.log(err)
    );
  }

  getConfiguracionPersonalizada(){

    let iduser =  localStorage.getItem("id_user");
    // console.log("🚀 ~ file: guardados.component.ts ~ line 55 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ iduser", iduser)
    
    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente =>{
        this.confPersoDocente = confPersoDocente;
        console.log("NOMBRECV", this.nombre_cv, this.idUsuario, this.nombreBloque)
        // console.log("DATAPERSONALIZADA", this.confPersoDocente.filter((cvpersonalizado) => 
        // cvpersonalizado.bloque === this.nombreBloque 
        // && cvpersonalizado.nombre_cv === this.nombre_cv
        // && cvpersonalizado.cv === this.cvHash
        // ));

        this.arregloAtributos = this.confPersoDocente.filter((cvpersonalizado) => 
        cvpersonalizado.bloque === this.nombreBloque 
        && cvpersonalizado.nombre_cv === this.nombre_cv
        && cvpersonalizado.cv === this.cvHash
        );

        this.atributosOrdenados = _.orderBy(this.arregloAtributos, ["orden", "atributo"],["asc", "asc"]);
        this.arregloAtributos = this.atributosOrdenados;
        console.log("🚀 ~ file: creacv-personalizado.component.ts ~ line 155 ~ CreacvPersonalizadoComponent ~ getConfiguracionPersonalizada ~ this.arregloAtributos", this.arregloAtributos)
  
        this.dataSource = new MatTableDataSource(this.arregloAtributos);
        this.dataSource.paginator = this.paginator;
  
        this.atributosOriginal = JSON.parse(
          JSON.stringify(confPersoDocente)
        );
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  FiltroNoVisibles() {
    let iduser =  localStorage.getItem("id_user");

    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente =>{
        this.confPersoDocente = confPersoDocente;
        console.log("NOMBRECV", this.nombre_cv, this.idUsuario, this.nombreBloque)
        // console.log("DATAPERSONALIZADA", this.confPersoDocente.filter((cvpersonalizado) => 
        // cvpersonalizado.bloque === this.nombreBloque 
        // && cvpersonalizado.nombre_cv === this.nombre_cv
        // && cvpersonalizado.cv === this.cvHash));

        this.arregloAtributos = this.confPersoDocente.filter((cvpersonalizado) => 
        cvpersonalizado.bloque === this.nombreBloque 
        && cvpersonalizado.nombre_cv === this.nombre_cv
        && cvpersonalizado.cv === this.cvHash);
        this.atributosOrdenados = _.filter(this.arregloAtributos,['visible_cv_personalizado', false ]);
        // console.log("🚀 ~ file: creacv-personalizado.component.ts ~ line 165 ~ CreacvPersonalizadoComponent ~ FiltroNoVisibles ~ this.atributosOrdenados", this.atributosOrdenados)
        
        this.arregloAtributos = _.orderBy(this.atributosOrdenados, ["orden", "atributo"],["asc", "asc"]);

        this.dataSource = new MatTableDataSource(this.arregloAtributos);
        this.dataSource.paginator = this.paginator;

        console.log("FILTRADOBLOQUENOVISIBLEPERSONALIZADO", this.arregloAtributos);
        this.atributosOriginal = JSON.parse(
          JSON.stringify(confPersoDocente)
        );
      },
        (err) => console.log(err)
      );

    
  }

  FiltroVisibles() {
    let iduser =  localStorage.getItem("id_user");
    console.log("CVHASHAEDITAR", this.cvHash)
    
    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente =>{
        this.confPersoDocente = confPersoDocente;
        console.log("NOMBRECV", this.nombre_cv, this.idUsuario, this.nombreBloque)
        // console.log("DATAPERSONALIZADA", this.confPersoDocente.filter((cvpersonalizado) => 
        // cvpersonalizado.bloque === this.nombreBloque 
        // && cvpersonalizado.nombre_cv === this.nombre_cv
        // && cvpersonalizado.cv === this.cvHash));

        this.arregloAtributos = this.confPersoDocente.filter((cvpersonalizado) => 
        cvpersonalizado.bloque === this.nombreBloque 
        && cvpersonalizado.nombre_cv === this.nombre_cv
        && cvpersonalizado.cv === this.cvHash
        );
        this.atributosOrdenados = _.filter(this.arregloAtributos,['visible_cv_personalizado', true ]);
        // console.log("🚀 ~ file: creacv-personalizado.component.ts ~ line 196 ~ CreacvPersonalizadoComponent ~ FiltroVisibles ~ this.atributosOrdenados", this.atributosOrdenados)
        
        this.arregloAtributos = _.orderBy(this.atributosOrdenados, ["orden", "atributo"],["asc", "asc"]);
        // console.log("🚀 ~ file: creacv-personalizado.component.ts ~ line 229 ~ CreacvPersonalizadoComponent ~ FiltroVisibles ~ this.arregloAtributos", this.arregloAtributos)

        this.dataSource = new MatTableDataSource(this.arregloAtributos);
        this.dataSource.paginator = this.paginator;

        console.log("FILTRADOBLOQUENOVISIBLEPERSONALIZADO", this.arregloAtributos);
        this.atributosOriginal = JSON.parse(
          JSON.stringify(confPersoDocente)
        );
      },
        (err) => console.log(err) 
      );
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
    this.arregloAtributos.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (atributo)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      // console.log("atributo", atributo)
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo 
        && atribtutoOriginal.visible_cv_personalizado == atributo.visible_cv_personalizado) return;      
      this.configuracioncvService
        .putConfiguracionPersonalizada(atributo)
        .subscribe((res) => {
          console.log('res', res)
         
        });
        this._snackBar.open("Se guardó  correctamente", "Cerrar", {
          duration: 2000,
        });
    });

    this.getConfiguracionPersonalizada();
    
    console.log("ATRIBUTOSORIGINAL", this.arregloAtributos)
  }


  alertaGuardarCambios() {
    this.arregloAtributos.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      console.log("ATRIBUTOORIGINALORDEN", atribtutoOriginal.orden, atributo.orden)
      if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo 
        && atribtutoOriginal.visible_cv_personalizado == atributo.visible_cv_personalizado) return;
      // console.log("guardado", bloque)


      this.alertaCambios = true;

      if (this.alertaCambios === true) {
        this.router.navigate(['/crea-personalizado/' + this.nombreBloque + '/' + this.nombre_cv + '/' + this.cvHash]);
        this._snackBar.open("Asegurate de Guardar los cambios", "Cerrar", {
          duration: 2000,
        });
      }


    });
    console.log("ALERTACAMBIOS", this.alertaCambios)

  }

 
  deshabilitaRetroceso(){
    window.location.hash="no-back-button";
    window.location.hash="Again-No-back-button" //chrome
    window.onhashchange=function(){window.location.hash="no-back-button";}
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
