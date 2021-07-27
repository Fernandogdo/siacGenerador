import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Configuracioncv } from 'app/models/configuracioncv.model';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import {MatSnackBar} from '@angular/material/snack-bar';import { Router } from '@angular/router';
import * as _ from "lodash";
@Component({
  selector: 'app-bloque-resumido',
  templateUrl: './bloque-resumido.component.html',
  styleUrls: ['./bloque-resumido.component.css']
})
export class BloqueResumidoComponent implements OnInit {

  nombreBloque;
  arregloBloques = [];
  atributosOriginal;

  constructor(
    private route: ActivatedRoute,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.nombreBloque = this.route.snapshot.params['nombre']
    console.log('NOMBREBLOQUE', this.nombreBloque);
    this.getConfiguracion()
  }

  getConfiguracion() {
    this.configuracioncvService.getConfiguraciones().subscribe(
      res => {
        this.configuracioncvService.configuraciones = res;
        const filteredCategories = [];
        res.forEach(configuracion => {
          if (!filteredCategories.find(cat => cat.bloque == configuracion.bloque && cat.atributo == configuracion.atributo)) {
            const { id, bloque, atributo, orden, mapeo, visible_cv_completo, visible_cv_resumido, administrador } = configuracion;
            filteredCategories.push({ id, bloque, atributo, orden, mapeo, visible_cv_completo, visible_cv_resumido, administrador });
          }
        });

        this.configuracioncvService.configuraciones = filteredCategories;
        
        this.arregloBloques = filteredCategories.filter(user => user.bloque === this.nombreBloque)
        let atributosOrdenados = _.orderBy(this.arregloBloques,['orden'], ['asc'])
        this.arregloBloques = atributosOrdenados

        this.atributosOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      },
      err => console.log(err)
    )
  }


  guardar() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      // console.log(bloque)
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo && 
        atribtutoOriginal.visible_cv_resumido == atributo.visible_cv_resumido ) return;

      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService
        .putConfiguracion(atributo)
        .subscribe((res) => {
          console.log("editado", res);
          this.getConfiguracion();
        });
        this._snackBar.open("Se guardó correctamente", "Cerrar", {
          duration: 2000,
        });
    });
  }

}
