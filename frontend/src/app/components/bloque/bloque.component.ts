import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { ConfiguracioncvService } from "../../services/configuracioncv.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';


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
  alertaCambios: boolean = false;

  visibilidad: boolean = false
  textoVisibilidad: string;

  constructor(
    private route: ActivatedRoute,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.nombreBloque = this.route.snapshot.params["nombre"];
    this.getConfiguracion();
    this.completo = true
  }

  scrollToTop(): void {
    window.scrollTo(0, 0);
  }


  getConfiguracion() {
    this.visibilidad = true
    this.textoVisibilidad = 'Todo'
    this.configuracioncvService.getConfiguraciones().subscribe(
      (configuracion) => {
        this.configuracioncvService.configuraciones = configuracion;

        this.arregloBloques = configuracion.filter((user) => user.bloque === this.nombreBloque);
        this.atributosOrdenCompletoados = _.orderBy(this.arregloBloques, ["ordenCompleto", "atributo"], ["asc", "asc"]);
        this.arregloBloques = this.atributosOrdenCompletoados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        this.atributosOriginal = JSON.parse(
          JSON.stringify(configuracion)
        );
      },
      (err) => console.log(err)
    );
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  FiltroNoVisibles() {
    this.visibilidad = true
    this.textoVisibilidad = 'No Visibles'
    this.configuracioncvService.getConfiguraciones().subscribe(
      (configuracion) => {
        this.configuracioncvService.configuraciones = configuracion;

        this.arregloBloques = configuracion.filter((user) => user.bloque === this.nombreBloque);

        let filtro = _.filter(this.arregloBloques, ['visible_cv_completo', false]);
        this.atributosOrdenCompletoados = _.orderBy(filtro, ["ordenCompleto", "atributo"], ["asc", "asc"]);
        this.arregloBloques = this.atributosOrdenCompletoados;

        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        this.atributosOriginal = JSON.parse(
          JSON.stringify(configuracion)
        );
      },
      (err) => console.log(err)
    );

  }


  FiltroVisibles() {
    this.visibilidad = true
    this.textoVisibilidad = 'Visibles'
    this.configuracioncvService.getConfiguraciones().subscribe(
      (configuracion) => {
        this.configuracioncvService.configuraciones = configuracion;
        this.arregloBloques = configuracion.filter((user) => user.bloque === this.nombreBloque);

        let filtro = _.filter(this.arregloBloques, ['visible_cv_completo', true]);
        this.atributosOrdenCompletoados = _.orderBy(filtro, ["ordenCompleto", "atributo"], ["asc", "asc"]);
        this.arregloBloques = this.atributosOrdenCompletoados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        this.atributosOriginal = JSON.parse(
          JSON.stringify(configuracion)
        );
      },
      (err) => console.log(err)
    );
  }

  valor(id) {
    this.id = id
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
  }

  guardar() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      if (atribtutoOriginal.ordenCompleto == atributo.ordenCompleto && atribtutoOriginal.mapeo == atributo.mapeo && atribtutoOriginal.visible_cv_completo == atributo.visible_cv_completo) return;

      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService
        .putConfiguracion(atributo)
        .subscribe((res) => {
          this.getConfiguracion();
        }, (error) => {
          // console.log("ERROR", error)
        });
      this._snackBar.open("Se guardó correctamente", "Cerrar", {
        duration: 2000,
      });
    });
  }

  alertaGuardarCambios() {
    this.arregloBloques.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      if (atribtutoOriginal.ordenCompleto == atributo.ordenCompleto 
        && atribtutoOriginal.mapeo == atributo.mapeo 
        && atribtutoOriginal.visible_cv_completo == atributo.visible_cv_completo) return;

      // si el bloque se modificó proceder y no se guardo proceder a mostrar alerta
      this.alertaCambios = true;

      if (this.alertaCambios === true) {
        this.router.navigate(['/bloque-completo/' + this.nombreBloque]);
        this._snackBar.open("Asegurate de Guardar los cambios", "Cerrar", {
          duration: 2000,
        });
      }
    });
  }

}
