import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ConfiguracioncvService } from '../../services/configuracioncv.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { MatTableDataSource } from '@angular/material/table';
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
    this.nombreBloque = this.route.snapshot.params['nombre']
    console.log('NOMBREBLOQUE', this.nombreBloque);
    this.getConfiguracion()
  }


  getConfiguracion() {
    this.visibilidad = true
    this.textoVisibilidad = 'Todo'
    this.configuracioncvService.getConfiguraciones().subscribe(
      res => {
        this.configuracioncvService.configuraciones = res;
        this.arregloBloques = res.filter((user) => user.bloque === this.nombreBloque);

        // this.arregloBloques = filteredCategories.filter(user => user.bloque === this.nombreBloque)
        let atributosOrdenados = _.orderBy(this.arregloBloques, ['ordenResumido'], ['asc'])

        this.arregloBloques = atributosOrdenados


        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;

        console.log("FILTRADOBLOQUE", this.arregloBloques);

        this.atributosOriginal = JSON.parse(
          JSON.stringify(res)
        );
        console.log("ATRIBUTOSIRIGINAL", this.atributosOriginal)
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
    this.visibilidad = true
    this.textoVisibilidad = 'No Visibles'
    this.configuracioncvService.getConfiguraciones().subscribe(
      (configuracion) => {
        this.configuracioncvService.configuraciones = configuracion;

        this.arregloBloques = configuracion.filter((user) => user.bloque === this.nombreBloque);
        let filtro = _.filter(this.arregloBloques, ['visible_cv_resumido', false]);
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
  

  FiltroVisibles() {
    this.visibilidad = true
    this.textoVisibilidad = 'Visibles'
    this.configuracioncvService.getConfiguraciones().subscribe(
      (configuracion) => {
        this.configuracioncvService.configuraciones = configuracion;
        this.arregloBloques = configuracion.filter((user) => user.bloque === this.nombreBloque);
        let filtro = _.filter(this.arregloBloques, ['visible_cv_resumido', true]);
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

  valor(id) {
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
        atribtutoOriginal.visible_cv_resumido == atributo.visible_cv_resumido) return;

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


  alertaGuardarCambios() {
    this.arregloBloques.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      if (atribtutoOriginal.ordenResumido == atributo.ordenResumido && atribtutoOriginal.mapeo == atributo.mapeo &&
        atribtutoOriginal.visible_cv_resumido == atributo.visible_cv_resumido) return;


      // si el bloque se modificó proceder y no se guardo proceder a mostrar alerta
      this.alertaCambios = true;

      if (this.alertaCambios === true) {
        this.router.navigate(['/bloque-resumido/' + this.nombreBloque]);
        this._snackBar.open("Asegurate de Guardar los cambios", "Cerrar", {
          duration: 2000,
        });
      }

    });
  }

}
