import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Bloque } from "app/models/bloque.model";
import { Configuracioncv } from "app/models/configuracioncv.model";
import { ConfiguracioncvService } from "app/services/configuracioncv.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import * as _ from "lodash";
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {ThemePalette} from '@angular/material/core';


@Component({
  selector: "app-bloque",
  templateUrl: "./bloque.component.html",
  styleUrls: ["./bloque.component.css"],
})
export class BloqueComponent implements OnInit {
  

  @ViewChild(MatPaginator) paginator: MatPaginator;

  completo: boolean;
  nombreBloque;
  arregloBloques = [];
  atributosOrdenCompletoados;
  atributosOriginal;
  databloques;
  displayedColumns: string[] = ['visible_cv_completo', 'atributo', 'ordenCompleto', 'mapeo'];
  dataSource;
  id;
  parentSelector: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.nombreBloque = this.route.snapshot.params["nombre"];
    this.getConfiguracion();
    this.completo = true
    
  }

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
              ordenCompleto,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            } = configuracion;
            filteredCategories.push({
              id,
              bloque,
              atributo,
              ordenCompleto,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            });
          }
        });

        this.configuracioncvService.configuraciones = filteredCategories;
        this.arregloBloques = filteredCategories.filter((user) => user.bloque === this.nombreBloque);
        this.atributosOrdenCompletoados = _.orderBy(this.arregloBloques, ["ordenCompleto", "atributo"],["asc", "asc"]);
        this.arregloBloques = this.atributosOrdenCompletoados;
        console.log("ARREGLOBLOQUES", this.arregloBloques)
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        // console.log("FILTRADOBLOQUE", this.arregloBloques);
        this.atributosOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      },
      (err) => console.log(err)
    );
  }


  // getBloques() {
  //   this.configuracioncvService.getBloques()
  //     .subscribe(res => {
  //       this.arregloBloques = res
  //       let atributosOrdenCompletoados = _.orderBy(this.arregloBloques,['ordenCompletoCompleto', ], ['asc']);
  //       this.arregloBloques = atributosOrdenCompletoados;
  //       this.dataSource = new MatTableDataSource(this.arregloBloques);
  //       // this.selection = new SelectionModel<Bloque>(true, []);
  //       this.dataSource.paginator = this.paginator;
  //       this.bloquesOriginal = JSON.parse(
  //         JSON.stringify(this.arregloBloques)
  //       );
  //     });
  // }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  
  FiltroNoVisibles() {
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
              ordenCompleto,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            } = configuracion;
            filteredCategories.push({
              id,
              bloque,
              atributo,
              ordenCompleto,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            });
          }
        });

        this.configuracioncvService.configuraciones = filteredCategories;
        this.arregloBloques = filteredCategories.filter((user) => user.bloque === this.nombreBloque);
       
        let filtro = _.filter(this.arregloBloques,['visible_cv_completo', false ]);
        // this.atributosOrdenCompletoados = filtro
        console.log("ARREGLOBLOQUESNOVISIBLES", filtro)
        this.atributosOrdenCompletoados = _.orderBy(filtro, ["ordenCompleto", "atributo"],["asc", "asc"]);
        this.arregloBloques = this.atributosOrdenCompletoados;

        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        // console.log("FILTRADOBLOQUE", this.arregloBloques);
        this.atributosOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      },
      (err) => console.log(err)
    );
    
  }
  // FiltroNoVisibles() {
  //   //Si checkbox es true muestra bloques No visibles caso contrario muestra todos los bloques 
  //   // if (event.checked) {
  //     console.log('asdsa')
  //     this.configuracioncvService.getBloques()
  //     .subscribe(res => {
  //       this.arregloBloques = res
  //       let atributosOrdenCompletoados = _.filter(this.arregloBloques,['visible_cv_completo', false ]);
  //       this.arregloBloques = atributosOrdenCompletoados;
  //       this.dataSource = new MatTableDataSource(this.arregloBloques);
  //       this.atributosOriginal = JSON.parse(
  //         JSON.stringify(this.arregloBloques)
  //       );
  //     });
  //   // } 
  //   // else {
  //   //   this.getBloques()
  //   // }
  // }


  FiltroVisibles() {
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
              ordenCompleto,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            } = configuracion;
            filteredCategories.push({
              id,
              bloque,
              atributo,
              ordenCompleto,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            });
          }
        });

        this.configuracioncvService.configuraciones = filteredCategories;
        this.arregloBloques = filteredCategories.filter((user) => user.bloque === this.nombreBloque);

        let filtro = _.filter(this.arregloBloques,['visible_cv_completo', true ]);
        console.log("ARREGLOBLOQUEVISIBLES", filtro)
        this.atributosOrdenCompletoados = _.orderBy(filtro, ["ordenCompleto", "atributo"],["asc", "asc"]);
        this.arregloBloques = this.atributosOrdenCompletoados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        // console.log("FILTRADOBLOQUE", this.arregloBloques);
        this.atributosOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      },
      (err) => console.log(err)
    );
  }

  // FiltroVisibles() {
  //   //Si checkbox es true muestra bloques visibles caso contrario muestra todos los bloques
  //   // console.log(event.checked)
  //   // if (event.checked) {
  //     this.configuracioncvService.getBloques()
  //     .subscribe(res => {
  //       this.arregloBloques = res
  //       let atributosOrdenCompletoados = _.filter(this.arregloBloques,['visible_cv_completo', true ]);
  //       this.arregloBloques = atributosOrdenCompletoados;
  //       this.dataSource = new MatTableDataSource(this.arregloBloques);
  //       this.atributosOriginal = JSON.parse(
  //         JSON.stringify(this.arregloBloques)
  //       );
  //     });
  //   // } else {
  //   //   this.getBloques()
  //   // }
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
    this.arregloBloques.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      console.log("BLOQUESORIGINAL", atribtutoOriginal.ordenCompleto, atributo.ordenCompleto)
      if (atribtutoOriginal.ordenCompleto == atributo.ordenCompleto && atribtutoOriginal.mapeo == atributo.mapeo && atribtutoOriginal.visible_cv_completo == atributo.visible_cv_completo) return;

      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService
        .putConfiguracion(atributo)
        .subscribe((res) => {
          console.log("editado", res);
          // this._snackBar.open("Se guardó  correctamente", "Cerrar", {
          //   duration: 2000,
          // });
          this.getConfiguracion();
        });
        this._snackBar.open("Se guardó correctamente", "Cerrar", {
          duration: 2000,
        });
        // this.getConfiguracion();
    }); 
  }

}
