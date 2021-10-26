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
 
  displayedColumns: string[] = ['visible_cv_bloqueCompleto', 'nombre', 'ordenCompleto', 'ingreso'];
  dataSource;
  // selection = new SelectionModel<Bloque>(true, []);
  // filterValues: any = {};
  nombre: boolean;
  visible_cv_bloqueCompleto: boolean;
  novisible_cv_bloqueCompleto: boolean;
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


  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques,['ordenCompleto'], ['asc']);
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
        let atributosOrdenados = _.filter(this.arregloBloques,['visible_cv_bloqueCompleto', false ]);
        this.arregloBloques = _.orderBy(atributosOrdenados,['ordenCompleto'], ['asc']);
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
      this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res;
        let atributosOrdenados = _.filter(this.arregloBloques,['visible_cv_bloqueCompleto', true ]);
        // this.arregloBloques = atributosOrdenados
        this.arregloBloques = _.orderBy(atributosOrdenados,['ordenCompleto'], ['asc']);
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
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
      if(bloqueOriginal.ordenCompleto == bloque.ordenCompleto && 
        bloqueOriginal.visible_cv_bloqueCompleto == bloque.visible_cv_bloqueCompleto) return
        console.log("guardado", bloque)
      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService.putBloque(bloque).subscribe((res) => {
          console.log("editado", res);
          this.getBloques();
        });
        // this._snackBar.open("Se guardó correctamente", "Cerrar", {
        //   duration: 2000,
        // });
        this._snackBar.open('This is a notification', 'X', {
          duration: 5000,
          verticalPosition: 'top',
          panelClass: ["red-snackbar"]
        });
    });
  }


  openDialog() {
    this.dialog.open(ModalNotaComponent);
  }

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: [className]
    });
  }
 
  showSnackbarCssStyles(content, action, duration) {
    let sb = this._snackBar.open(content, action, {
      duration: duration,
      panelClass: ["red-snackbar"]
    });
    sb.onAction().subscribe(() => {
      sb.dismiss();
    });
  }

  
  // guardarViejo() {
  //   // iterar cada uno de los bloques
  //   this.arregloBloques.forEach((bloque) => {
  //     // para eficiencia se puede comprobar si el registro actual (bloque)
  //     // se ha modificado. Si sus campos son iguales al original entonces
  //     // no es necesario guardarlo
  //     // console.log(bloque)
  //     let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
  //     if(bloqueOriginal.ordenCompleto == bloque.ordenCompleto && 
  //       bloqueOriginal.visible_cv_bloque == bloque.visible_cv_bloque) return

  //     // si el bloque se modificó proceder a guardarlo
  //     this.configuracioncvService
  //       .putBloque(bloque)
  //       .subscribe((res) => {
  //         console.log("editado", res);
  //         this.getBloques();
  //       });
  //       this._snackBar.open("Se guardo correctamente", "Cerrar", {
  //         duration: 2000,
  //       });
  //   });
  // }

//   showNotification(from, align){
//     const type = ['','info','success','warning','danger'];

//     const color = Math.floor((Math.random() * 4) + 1);

//     $.notify({
//         icon: "notifications",
//         message: "Welcome to <b>Material Dashboard</b> - a beautiful freebie for every web developer."

//     },{
//         type: type[color],
//         timer: 4000,
//         placement: {
//             from: from,
//             align: align
//         },
//         template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
//           '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
//           '<i class="material-icons" data-notify="icon">notifications</i> ' +
//           '<span data-notify="title">{1}</span> ' +
//           '<span data-notify="message">{2}</span>' +
//           '<div class="progress" data-notify="progressbar">' +
//             '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
//           '</div>' +
//           '<a href="{3}" target="{4}" data-notify="url"></a>' +
//         '</div>'
//     });
// }

}

