import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Configuracioncv } from 'app/models/configuracioncv.model';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import {MatSnackBar} from '@angular/material/snack-bar';import { Router } from '@angular/router';
import * as _ from "lodash";
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-bloque-resumido',
  templateUrl: './bloque-resumido.component.html',
  styleUrls: ['./bloque-resumido.component.css']
})
export class BloqueResumidoComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['visible_cv_resumido', 'atributo', 'ordenResumido', 'mapeo'];

  nombreBloque;
  arregloBloques = [];
  atributosOrdenados;
  atributosOriginal;
  dataSource;
  id;
  parentSelector: boolean = false;

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
            const { id, bloque, atributo, ordenResumido, mapeo, visible_cv_completo, visible_cv_resumido, administrador } = configuracion;
            filteredCategories.push({ id, bloque, atributo, ordenResumido, mapeo, visible_cv_completo, visible_cv_resumido, administrador });
          }
        });

        this.configuracioncvService.configuraciones = filteredCategories;
        
        this.arregloBloques = filteredCategories.filter(user => user.bloque === this.nombreBloque)
        let atributosOrdenados = _.orderBy(this.arregloBloques,['ordenResumido'], ['asc'])
        this.arregloBloques = atributosOrdenados

        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        this.atributosOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      },
      err => console.log(err)
    )
  }


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
              ordenResumido,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            } = configuracion;
            filteredCategories.push({
              id,
              bloque,
              atributo,
              ordenResumido,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            });
          }
        });


        // let filtro = _.filter(this.arregloBloques,['visible_cv_completo', true ]);
        // this.atributosOrdenCompletoados = _.orderBy(filtro, ["ordenCompleto", "atributo"],["asc", "asc"]);
        // this.arregloBloques = this.atributosOrdenCompletoados;

        this.configuracioncvService.configuraciones = filteredCategories;
        this.arregloBloques = filteredCategories.filter((user) => user.bloque === this.nombreBloque);
        let filtro = _.filter(this.arregloBloques,['visible_cv_resumido', false ]);
        console.log("ARREGLOBLOQUEVISIBLES", filtro)
        this.atributosOrdenados = _.orderBy(filtro, ["ordenResumido"], ["asc"])
        this.arregloBloques = this.atributosOrdenados;

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
  //       let atributosOrdenados = _.filter(this.arregloBloques,['visible_cv_completo', false ]);
  //       this.arregloBloques = atributosOrdenados;
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
              ordenResumido,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            } = configuracion;
            filteredCategories.push({
              id,
              bloque,
              atributo,
              ordenResumido,
              mapeo,
              visible_cv_completo,
              visible_cv_resumido,
              administrador,
            });
          }
        });

        this.configuracioncvService.configuraciones = filteredCategories;
        this.arregloBloques = filteredCategories.filter((user) => user.bloque === this.nombreBloque);
        let filtro= _.filter(this.arregloBloques,['visible_cv_resumido', true ]);
        console.log("ARREGLOBLOQUEVISIBLES", filtro)
        this.atributosOrdenados = _.orderBy(filtro, ["ordenResumido"], ["asc"])
        this.arregloBloques = this.atributosOrdenados;
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

  valor(id){
    this.id = id
    console.log('id', this.id)
  }


  onChangeAtributo($event) {
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.arregloBloques = this.arregloBloques.map((d) => {
      if (d.id == id) {
        d.visible_cv_resumido = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.visible_cv_resumido = this.parentSelector;
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
      // console.log(bloque)
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      if (atribtutoOriginal.ordenResumido == atributo.ordenResumido && atribtutoOriginal.mapeo == atributo.mapeo && 
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
