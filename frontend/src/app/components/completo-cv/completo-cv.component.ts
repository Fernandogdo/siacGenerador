import { Component, ViewChild, OnInit } from '@angular/core';
import { ConfiguracioncvService } from './../../services/configuracioncv.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import * as _ from "lodash";
import { Bloque } from '../../models/bloque.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { BloqueServicioService } from '../../services/servicios-bloque/bloque-servicio.service';

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
  visibilidad: boolean = false
  textoVisibilidad: string;
  checked: boolean = true;
  parentSelector: boolean = false;
  id;
  Object = Object;


  constructor(
    private dialog: MatDialog,
    public configuracioncvService: ConfiguracioncvService,
    private bloqueServicioService: BloqueServicioService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.getBloques()
    this.setIntrvl()
  }


  getBloques() {
    this.visibilidad = true
    this.textoVisibilidad  = 'Todo'
    this.bloqueServicioService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques, ['ordenCompleto'], ['asc']);
        this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
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
    this.visibilidad = true
    this.textoVisibilidad = 'No Visibles'
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
    this.visibilidad = true
    this.textoVisibilidad = 'Visibles'

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
  }


  setIntrvl() {
    // setTimeout(() => this.compararArregloAtributos(), 6000);
    setTimeout(() => this.actualizaOrdenPersonalizable(), 30000);
  }


  actualizaOrdenPersonalizable() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if (bloqueOriginal.ordenCompleto == bloque.ordenCompleto &&
        bloqueOriginal.visible_cv_bloqueCompleto == bloque.visible_cv_bloqueCompleto) return
      const objeto = {
        id: bloque.id,
        nombre: bloque.nombre,
        nombreService:bloque.nombreService,
        ordenCompleto: bloque.ordenCompleto,
        ordenPersonalizable: bloque.ordenCompleto,
        ordenResumido: bloque.ordenResumido,
        visible_cv_bloqueCompleto: bloque.visible_cv_bloqueCompleto,
        visible_cv_bloqueResumido: bloque.visible_cv_bloqueResumido
      }
      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService.putBloque(objeto).subscribe((res) => {
        this.getBloques();
      });
      this._snackBar.open("Se guardó correctamente", "Cerrar", {
        duration: 2000,
      });
    });
  }


  guardar() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if (bloqueOriginal.ordenCompleto == bloque.ordenCompleto &&
        bloqueOriginal.visible_cv_bloqueCompleto == bloque.visible_cv_bloqueCompleto) return
      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService.putBloque(bloque).subscribe((res) => {
        this.getBloques();
      });
      this._snackBar.open("Se guardó correctamente", "Cerrar", {
        duration: 2000,
      });
    });
    this.actualizaOrdenPersonalizable()
  }


  // openDialog() {
  //   this.dialog.open(ModalNotaComponent);
  // }

  alertaGuardarCambios() {
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if (bloqueOriginal.ordenCompleto == bloque.ordenCompleto &&
        bloqueOriginal.visible_cv_bloqueCompleto == bloque.visible_cv_bloqueCompleto) return
      this.alertaCambios = true;

      if (this.alertaCambios === true) {
        this.router.navigate(['/cv-completo']);
        this._snackBar.open("Asegurate de Guardar los cambios", "Cerrar", {
          duration: 2000,
        });
      }
    });
  }

}

