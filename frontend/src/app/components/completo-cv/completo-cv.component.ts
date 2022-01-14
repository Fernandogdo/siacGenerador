import { Component, ViewChild, OnInit } from '@angular/core';
import { ConfiguracioncvService } from './../../services/configuracioncv.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import * as _ from "lodash";
import { ModalNotaComponent } from '../modal-nota/modal-nota.component';
import { Bloque } from '../../models/bloque.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BloqueServicioService } from '../../services/servicios-bloque/bloque-servicio.service';
// import { SelectionModel } from '@angular/cdk/collections';

BloqueServicioService
@Component({
  selector: 'app-completo-cv',
  templateUrl: './completo-cv.component.html',
  styleUrls: ['./completo-cv.component.css']
})
export class CompletoCvComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;


  displayedColumns: string[] = ['visible_cv_bloqueCompleto', 'nombre', 'ordenCompleto', 'ingreso'];
  arregloBloques: Bloque[] = [];
  bloquesOriginal;
  dataSource;

  nombre: boolean;
  visible_cv_bloqueCompleto: boolean;
  novisible_cv_bloqueCompleto: boolean;
  claves: any = [];
  esquemas: any = [];
  atributos_articulos: any = [];
  componentes: string[] = [];
  configuracioncv: any;
  alertaCambios: boolean = false;


  checked: boolean = true;


  parentSelector: boolean = false;
  id;

  Object = Object;


  constructor(
    private dialog: MatDialog,
    public configuracioncvService: ConfiguracioncvService,
    private bloqueServicioService :BloqueServicioService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.getBloques()
  }

 

  configuracion() {
    // this.configuracioncvService.copiaEsquema()
    // this.configuracioncvService.recorreConfiguracion();
  }

  getBloques() {
    this.bloqueServicioService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques, ['ordenCompleto'], ['asc']);
        this.arregloBloques = atributosOrdenados;
        console.log("ARREGLOBLOQUES", this.arregloBloques)
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        // this.selection = new SelectionModel<Bloque>(true, []);
        this.paginator._intl.itemsPerPageLabel = 'Ítems por página';
        this.dataSource.paginator = this.paginator;
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
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
        let atributosOrdenados = _.filter(this.arregloBloques, ['visible_cv_bloqueCompleto', false]);
        this.arregloBloques = _.orderBy(atributosOrdenados, ['ordenCompleto'], ['asc']);
        // this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
  }


  FiltroVisibles() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res;
        let atributosOrdenados = _.filter(this.arregloBloques, ['visible_cv_bloqueCompleto', true]);
        // this.arregloBloques = atributosOrdenados
        this.arregloBloques = _.orderBy(atributosOrdenados, ['ordenCompleto'], ['asc']);
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
  }

  valor(id) {
    this.id = id
    console.log('id', this.id)
  }

  onChangeBloque($event) {
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.arregloBloques = this.arregloBloques.map((d) => {
      if (d.id == id) {
        d.visible_cv_bloqueCompleto = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.visible_cv_bloqueCompleto = this.parentSelector;
        return d;
      }
      return d;
    });
    console.log("food", this.arregloBloques);
  }


  guardar(className: string) {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if (bloqueOriginal.ordenCompleto == bloque.ordenCompleto &&
        bloqueOriginal.visible_cv_bloqueCompleto == bloque.visible_cv_bloqueCompleto) return
      console.log("guardado", bloque)
      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService.putBloque(bloque).subscribe((res) => {
        console.log("editado", res);
        this.getBloques();
      });
      this._snackBar.open("Se guardó correctamente", "Cerrar", {
        duration: 2000,
      });
    });
  }


  openDialog() {
    this.dialog.open(ModalNotaComponent);
  }


  alertaGuardarCambios() {
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if (bloqueOriginal.ordenCompleto == bloque.ordenCompleto &&
        bloqueOriginal.visible_cv_bloqueCompleto == bloque.visible_cv_bloqueCompleto) return
      // console.log("guardado", bloque)


      this.alertaCambios = true;

      if (this.alertaCambios === true) {
        this.router.navigate(['/cv-completo']);
        this._snackBar.open("Asegurate de Guardar los cambios", "Cerrar", {
          duration: 2000,
        });
      }


    });
    console.log("ALERTACAMBIOS", this.alertaCambios)

  }

  // openSnackBar(message: string, action: string, className: string) {
  //   this._snackBar.open(message, action, {
  //     duration: 2000,
  //     panelClass: [className]
  //   });
  // }

  // showSnackbarCssStyles(content, action, duration) {
  //   let sb = this._snackBar.open(content, action, {
  //     duration: duration,
  //     panelClass: ["red-snackbar"]
  //   });
  //   sb.onAction().subscribe(() => {
  //     sb.dismiss();
  //   });
  // }

}

