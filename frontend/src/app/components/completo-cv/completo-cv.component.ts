import { Configuracioncv } from './../../models/configuracioncv.model';
import { ProyectosService } from './../../services/proyectos.service';

import { Component, ViewChild, ElementRef, OnInit, Inject } from '@angular/core';
import { ConfiguracioncvService } from './../../services/configuracioncv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import * as _ from "lodash";
import { ModalNotaComponent } from '../modal-nota/modal-nota.component';
import { Bloque } from 'app/models/bloque.model';
import { event } from 'jquery';

@Component({
  selector: 'app-completo-cv',
  templateUrl: './completo-cv.component.html',
  styleUrls: ['./completo-cv.component.css']
})
export class CompletoCvComponent implements OnInit {

  
  arregloBloques: Bloque[]= [];
  bloquesOriginal;
 
  displayedColumns: string[] = ['nombre', 'ordenCompleto', 'visible_cv_bloque', 'ingreso'];
  dataSource;
  filterValues: any = {};
  nombre: boolean;
  visible_cv_bloque: boolean;
  novisible_cv_bloque: boolean;
  claves: any = [];
  esquemas: any = [];
  atributos_articulos: any = [];
  componentes: string[] = [];
  configuracioncv: any;


  checked: boolean = true;
  valor = false

  Object = Object;


  constructor(
    private dialog: MatDialog,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getBloques()
    
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  FiltroNoVisibles() {
    //Si checkbox es true muestra bloques No visibles caso contrario muestra todos los bloques 
    // if (event.checked) {
      console.log('asdsa')
      this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.filter(this.arregloBloques,['visible_cv_bloque', false ]);
        this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
    // } 
    // else {
    //   this.getBloques()
    // }
  }


  FiltroVisibles() {
    //Si checkbox es true muestra bloques visibles caso contrario muestra todos los bloques
    // console.log(event.checked)
    // if (event.checked) {
      this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.filter(this.arregloBloques,['visible_cv_bloque', true ]);
        this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
    // } else {
    //   this.getBloques()
    // }
  }


  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques,['ordenCompleto', ], ['asc']);
        this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
  }

  guardar() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      // console.log(bloque)
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if(bloqueOriginal.ordenCompleto == bloque.ordenCompleto && 
        bloqueOriginal.visible_cv_bloque == bloque.visible_cv_bloque) return

      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService
        .putBloque(bloque)
        .subscribe((res) => {
          console.log("editado", res);
          this.getBloques();
        });
        this._snackBar.open("Se guardo correctamente", "Cerrar", {
          duration: 2000,
        });
    });
  }

  openDialog() {
    this.dialog.open(ModalNotaComponent);
  }

  

}

