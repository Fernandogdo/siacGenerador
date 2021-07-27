import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Bloque } from "app/models/bloque.model";
import { Configuracioncv } from "app/models/configuracioncv.model";
import { ConfiguracioncvService } from "app/services/configuracioncv.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: "app-bloque",
  templateUrl: "./bloque.component.html",
  styleUrls: ["./bloque.component.css"],
})
export class BloqueComponent implements OnInit {
  nombreBloque;
  arregloBloques = [];
  atributosOrdenados;
  atributosOriginal;

  constructor(
    private route: ActivatedRoute,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.nombreBloque = this.route.snapshot.params["nombre"];
    this.getConfiguracion();
  }

  getConfiguracion() {
    this.configuracioncvService.getConfiguraciones().subscribe(
      (res) => {
        this.configuracioncvService.configuraciones = res;
        const filteredCategories = [];
        res.forEach((configuracion) => {
          if (
            !filteredCategories.find(
              (cat) =>
                cat.bloque == configuracion.bloque &&
                cat.atributo == configuracion.atributo
            )
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

        this.arregloBloques = filteredCategories.filter(
          (user) => user.bloque === this.nombreBloque
        );
        this.atributosOrdenados = _.orderBy(
          this.arregloBloques,
          ["orden", "atributo"],
          ["asc", "asc"]
        );
        this.arregloBloques = this.atributosOrdenados;

        // console.log("FILTRADOBLOQUE", this.arregloBloques);
        this.atributosOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      },
      (err) => console.log(err)
    );
  }

  guardar() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      // console.log(bloque)
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo && atribtutoOriginal.visible_cv_completo == atributo.visible_cv_completo) return;

      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService
        .putConfiguracion(atributo)
        .subscribe((res) => {
          console.log("editado", res);
          this._snackBar.open("Se guardo correctamente", "Cerrar", {
            duration: 2000,
          });
          this.getConfiguracion();
        });
        // this.getConfiguracion();
    });
    
  }

}
