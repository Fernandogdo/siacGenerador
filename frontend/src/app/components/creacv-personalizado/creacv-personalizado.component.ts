import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Params, Router } from "@angular/router";
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfiguracioncvService } from "../../services/configuracioncv.service";
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
  

  visibilidad: boolean = false
  textoVisibilidad: string;
  nombreBloque;
  arregloBloques = [];
  arregloAtributos = []
  atributosOrdenados;
  atributosOriginal;
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
  ) { 
    this.NoBackNavigator()
  }

  ngOnInit(): void {
    this.cvHash = this.route.snapshot.params["cv"];
    this.nombreBloque = this.route.snapshot.params["nombre"];
    this.nombre_cv = this.route.snapshot.params["nombre_cv"];
    this.getConfiguracionPersonalizada();
    this.idUsuario =   parseInt(localStorage.getItem('id_user'));
  }


  NoBackNavigator() {
    
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

        this.atributosOriginal = JSON.parse(
          JSON.stringify(res)
        );
      },
      (err) => console.log(err)
    );
  }

  getConfiguracionPersonalizada(){
    this.visibilidad = true
    this.textoVisibilidad  = 'Todo'

    let iduser =  localStorage.getItem("id_user");
    
    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente =>{
        this.confPersoDocente = confPersoDocente;
       
        this.arregloAtributos = this.confPersoDocente.filter((cvpersonalizado) => 
        cvpersonalizado.bloque === this.nombreBloque 
        && cvpersonalizado.nombre_cv === this.nombre_cv
        && cvpersonalizado.cv === this.cvHash
        );

        this.atributosOrdenados = _.orderBy(this.arregloAtributos, ["orden", "atributo"],["asc", "asc"]);
        this.arregloAtributos = this.atributosOrdenados;
  
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
    this.visibilidad = true
    this.textoVisibilidad  = 'No Visibles'
    let iduser =  localStorage.getItem("id_user");

    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente =>{
        this.confPersoDocente = confPersoDocente;
       
        this.arregloAtributos = this.confPersoDocente.filter((cvpersonalizado) => 
        cvpersonalizado.bloque === this.nombreBloque 
        && cvpersonalizado.nombre_cv === this.nombre_cv
        && cvpersonalizado.cv === this.cvHash);
        this.atributosOrdenados = _.filter(this.arregloAtributos,['visible_cv_personalizado', false ]);
        
        this.arregloAtributos = _.orderBy(this.atributosOrdenados, ["orden", "atributo"],["asc", "asc"]);

        this.dataSource = new MatTableDataSource(this.arregloAtributos);
        this.dataSource.paginator = this.paginator;

        this.atributosOriginal = JSON.parse(
          JSON.stringify(confPersoDocente)
        );
      },
        (err) => console.log(err)
      );

    
  }

  FiltroVisibles() {
    this.visibilidad = true
    this.textoVisibilidad  = 'Visibles'
    let iduser =  localStorage.getItem("id_user");
    
    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente =>{
        this.confPersoDocente = confPersoDocente;

        this.arregloAtributos = this.confPersoDocente.filter((cvpersonalizado) => 
        cvpersonalizado.bloque === this.nombreBloque 
        && cvpersonalizado.nombre_cv === this.nombre_cv
        && cvpersonalizado.cv === this.cvHash
        );
        this.atributosOrdenados = _.filter(this.arregloAtributos,['visible_cv_personalizado', true ]);
        this.arregloAtributos = _.orderBy(this.atributosOrdenados, ["orden", "atributo"],["asc", "asc"]);

        this.dataSource = new MatTableDataSource(this.arregloAtributos);
        this.dataSource.paginator = this.paginator;

        this.atributosOriginal = JSON.parse(
          JSON.stringify(confPersoDocente)
        );
      },
        (err) => console.log(err) 
      );
  }


  valor(id){
    this.id = id
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
  }

  

  guardar() {
    // iterar cada uno de los bloques
    let iduser =  localStorage.getItem("id_user");
    this.arregloAtributos.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (atributo)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo 
        && atribtutoOriginal.visible_cv_personalizado == atributo.visible_cv_personalizado) return;      
      this.configuracioncvService
        .putConfiguracionPersonalizada(atributo)
        .subscribe((res) => {
          this.getConfiguracionPersonalizada();
         
        });
        this._snackBar.open("Se guardó  correctamente", "Cerrar", {
          duration: 2000,
        });
    });

  }


  alertaGuardarCambios() {
    this.arregloAtributos.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo 
        && atribtutoOriginal.visible_cv_personalizado == atributo.visible_cv_personalizado) return;


      this.alertaCambios = true;

      if (this.alertaCambios === true) {
        this.router.navigate(['/crea-personalizado/' + this.nombreBloque + '/' + this.nombre_cv + '/' + this.cvHash]);
        this._snackBar.open("Asegurate de Guardar los cambios", "Cerrar", {
          duration: 2000,
        });
      }


    });

  }

 
  deshabilitaRetroceso(){
    window.location.hash="no-back-button";
    window.location.hash="Again-No-back-button" //chrome
    window.onhashchange=function(){window.location.hash="no-back-button";}
  }


}
