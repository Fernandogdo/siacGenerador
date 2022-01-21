import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfiguracioncvService } from '../../services/configuracioncv.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalNotaComponent } from '../modal-nota/modal-nota.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


import * as _ from "lodash";

@Component({
  selector: 'app-resumido-cv',
  templateUrl: './resumido-cv.component.html',
  styleUrls: ['./resumido-cv.component.css']
})
export class ResumidoCvComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['visible_cv_bloqueResumido', 'nombre', 'ordenResumido', 'ingreso'];
  dataSource;

  parentSelector: boolean = false;
  id;

  arregloBloques = [];
  bloquesOriginal;
  alertaCambios: boolean = false;

  visibilidad: boolean = false
  textoVisibilidad: string;

  constructor(
    private dialog: MatDialog,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getBloques()
  }

  getBloques() {
    this.visibilidad = true
    this.textoVisibilidad = 'Todo'
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res = res;
        let atributosOrdenados = _.orderBy(this.arregloBloques, ['ordenResumido'], ['asc'])
        this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.dataSource.paginator = this.paginator;
        console.log("ARREGLOBLOQUESRESUMIDOS", this.arregloBloques)
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
    this.visibilidad = true
    this.textoVisibilidad = 'No Visibles'
    console.log('asdsa')
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.filter(this.arregloBloques, ['visible_cv_bloqueResumido', false]);
        this.arregloBloques = _.orderBy(atributosOrdenados, ['ordenResumido'], ['asc']);
        // this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
  }

  FiltroVisibles() {
    //Si checkbox es true muestra bloques visibles caso contrario muestra todos los bloques
    // console.log(event.checked)
    // if (event.checked) {
    this.visibilidad = true
    this.textoVisibilidad = 'Visibles'
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res;
        let atributosOrdenados = _.filter(this.arregloBloques, ['visible_cv_bloqueResumido', true]);
        this.arregloBloques = _.orderBy(atributosOrdenados, ['ordenResumido'], ['asc']);
        // this.arregloBloques = atributosOrdenados
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
        d.visible_cv_bloqueResumido = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.visible_cv_bloqueResumido = this.parentSelector;
        return d;
      }
      return d;
    });
    console.log("ARREGLOBLOQUESONcHANGE", this.arregloBloques);
  }


  guardar() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if (bloqueOriginal.ordenResumido == bloque.ordenResumido &&
        bloqueOriginal.visible_cv_bloqueResumido == bloque.visible_cv_bloqueResumido) return
      console.log("guardado", bloque)
      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService.putBloque(bloque).subscribe((res) => {
        console.log("editado", res);
        this.getBloques();
      });
      this._snackBar.open("Se guardó configuración CV resumido", "Cerrar", {
        duration: 3000,
      });
    });
  }

  openDialog() {
    this.dialog.open(ModalNotaComponent);
  }


  alertaGuardarCambios() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if (bloqueOriginal.ordenResumido == bloque.ordenResumido &&
        bloqueOriginal.visible_cv_bloqueResumido == bloque.visible_cv_bloqueResumido) return

      // si el bloque se modificó proceder a mostrar alerta
      this.alertaCambios = true;

      if (this.alertaCambios === true) {
        this.router.navigate(['/cv-resumido']);
        this._snackBar.open("Asegurate de Guardar los cambios", "Cerrar", {
          duration: 2000,
        });
      }
    });
  }
}
