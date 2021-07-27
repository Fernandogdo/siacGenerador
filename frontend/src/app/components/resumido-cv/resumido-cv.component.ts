import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { ModalNotaComponent } from '../modal-nota/modal-nota.component';

import * as _ from "lodash";

@Component({
  selector: 'app-resumido-cv',
  templateUrl: './resumido-cv.component.html',
  styleUrls: ['./resumido-cv.component.css']
})
export class ResumidoCvComponent implements OnInit {

  arregloBloques = [];
  bloquesOriginal;

  constructor(
    private dialog: MatDialog,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getBloques()
  }

  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res = res;
        let atributosOrdenados = _.orderBy(this.arregloBloques,['ordenResumido'], ['asc'])
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
      if(bloqueOriginal.ordenResumido == bloque.ordenResumido) return

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
