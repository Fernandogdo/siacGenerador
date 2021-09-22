import { Component, ViewChild, OnInit } from '@angular/core';
import { ConfiguracioncvService } from './../../services/configuracioncv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import * as _ from "lodash";
import { ModalNotaComponent } from '../modal-nota/modal-nota.component';
import { Bloque } from 'app/models/bloque.model';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
// import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-completo-cv',
  templateUrl: './completo-cv.component.html',
  styleUrls: ['./completo-cv.component.css']
})
export class CompletoCvComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  arregloBloques: Bloque[]= [];
  bloquesOriginal;
 
  displayedColumns: string[] = ['visible_cv_bloque', 'nombre', 'ordenCompleto', 'ingreso'];
  dataSource;
  // selection = new SelectionModel<Bloque>(true, []);
  // filterValues: any = {};
  nombre: boolean;
  visible_cv_bloque: boolean;
  novisible_cv_bloque: boolean;
  claves: any = [];
  esquemas: any = [];
  atributos_articulos: any = [];
  componentes: string[] = [];
  configuracioncv: any;
  

  checked: boolean = true;


  parentSelector: boolean = false;
  id;

  Object = Object;


  constructor(
    private dialog: MatDialog,
    public configuracioncvService: ConfiguracioncvService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getBloques()
    
  }


  T
  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques,['ordenCompleto', ], ['asc']);
        this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        // this.selection = new SelectionModel<Bloque>(true, []);
        this.dataSource.paginator = this.paginator;
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
  }

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   // console.log('numSelected', numSelected);
  //   const numRows = this.dataSource.data.length;
  //   // console.log('numRows', numRows);

  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected()
  //     ? this.selection.clear()
  //     : this.dataSource.data.forEach(row => this.selection.select(row));
  // }

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
        let atributosOrdenados = _.filter(this.arregloBloques,['visible_cv_bloque', false ]);
        this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
    // } 
    // else {
    //   this.getBloques()
    // }
  }


  FiltroVisibles() {
    //Si checkbox es true muestra bloques visibles caso contrario muestra todos los bloques
    // console.log(event.checked)
    // if (event.checked) {
      this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.filter(this.arregloBloques,['visible_cv_bloque', true ]);
        this.arregloBloques = atributosOrdenados;
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
    // } else {
    //   this.getBloques()
    // }
  }

  valor(id){
    this.id = id
    console.log('id', this.id)
  }

  onChangeBloque($event) {
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.arregloBloques = this.arregloBloques.map((d) => {
      if (d.id == id) {
        d.visible_cv_bloque = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.visible_cv_bloque = this.parentSelector;
        return d;
      }
      return d;
    });
    console.log("food", this.arregloBloques);
  }


  guardar() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if(bloqueOriginal.ordenCompleto == bloque.ordenCompleto && 
        bloqueOriginal.visible_cv_bloque == bloque.visible_cv_bloque) return
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

  

}

