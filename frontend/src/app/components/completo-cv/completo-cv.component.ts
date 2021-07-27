import { Configuracioncv } from './../../models/configuracioncv.model';
import { ProyectosService } from './../../services/proyectos.service';

import { Component, ViewChild, ElementRef, OnInit, Inject } from '@angular/core';
import { ConfiguracioncvService } from './../../services/configuracioncv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import * as _ from "lodash";
import { ModalNotaComponent } from '../modal-nota/modal-nota.component';

@Component({
  selector: 'app-completo-cv',
  templateUrl: './completo-cv.component.html',
  styleUrls: ['./completo-cv.component.css']
})
export class CompletoCvComponent implements OnInit {

  
  arregloBloques = [];
  bloquesOriginal;
 
  displayedColumns: string[] = ['nombre', 'ordenCompleto', 'nombre'];
  dataSource = new MatTableDataSource(this.arregloBloques);


  claves: any = [];
  esquemas: any = [];
  atributos_articulos: any = [];
  componentes: string[] = [];
  configuracioncv: any;


  Object = Object;


  constructor(
    private dialog: MatDialog,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getBloques()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques,['ordenCompleto', ], ['asc'])
        this.arregloBloques = atributosOrdenados
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
      if(bloqueOriginal.ordenCompleto == bloque.ordenCompleto) return

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