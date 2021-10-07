import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { ModalPersonalizacionComponent } from '../modal-personalizacion/modal-personalizacion.component';
import { Bloque } from 'app/models/bloque.model';
import { AuthorizationService } from 'app/services/login/authorization.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "lodash";
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-personalizado-cv',
  templateUrl: './personalizado-cv.component.html',
  styleUrls: ['./personalizado-cv.component.css']
})
export class PersonalizadoCvComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['visible_cv_bloqueCompleto', 'nombre', 'ordenPersonalizable', 'ingreso'];
  dataSource;

  arregloBloques = [];
  arregloBloquesConfiguracion = []
  arregloAtributos = []
  bloquesOriginal;

  form: FormGroup;

  // dialogEditPersonalizacion: MatDialogRef<ModalPersonalizacionComponent>;

  bloque;
  atributo;
  orden;
  visible_cv_personalizado;
  mapeo;
  cv;
  nombre_cv;
  data_user;
  id_user;
  miDataInterior = [];
  parentSelector: boolean = false;
  id;
  dataBloque = [];

  

  constructor(
    public authorizationService: AuthorizationService,
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar

  ) {
    this.form = this.fb.group({
      nombrecv: ['', Validators.required],
      orden: [1]
    })
  }

  ngOnInit(): void {
    this.getConfiguracionPersonalizada();
    this.getConfiguracion();
    this.getBloques();
    this.id_user = localStorage.getItem("id_user");
    this.authorizationService.getOneUser(this.id_user)
      .subscribe(res =>{
      console.log("🚀 ~ file: personalizado-cv.component.ts ~ line 52 ~ PersonalizadoCvComponent ~ ngOnInit ~ res", res)
      this.data_user = res;
      });
    this.nombre_cv = localStorage.getItem('nombre_cv');
  }

  public showDiv(): boolean {
    const name = this.form.value.nombrecv;
    return !!name;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  //Agregar 
  agregar(visible: string, idSeleccionado, bloque: string, atributo: string, mapeo: string) {
    console.log(this.form.value.nombrecv)
    let iduser =  localStorage.getItem("id_user");
    let hash = Math.random().toString(36).substring(2);
    const data = {
      configuracionId: idSeleccionado,
      id_user: iduser,
      bloque: bloque,
      atributo: atributo,
      orden: 1,
      visible_cv_personalizado: visible,
      mapeo: mapeo,
      cv: hash,
      nombre_cv: this.form.value.nombrecv,
      cedula: "123"
    }

    let conf = this.miDataInterior.push(data);
    console.log(conf);
  }

  quitar(atributo) {
    this.miDataInterior.splice(this.miDataInterior.indexOf(atributo), 1);
    console.log(this.miDataInterior)
  }

  PostConfiguracionPersonalizada() {
    console.log(this.miDataInterior);

    for (let i = 0; i < this.miDataInterior.length; i++) {
      let clave = this.miDataInterior[i];
      console.log('CLAVE', clave)
      this.configuracioncvService.postConfiguracionPersonalizada(clave)
        .subscribe(res => {
          this._snackBar.open('Guardado Correctamente', "Cerrar", {
            duration: 2000,
          });
          console.log('SEGUARDO', res)
        })
    }
  }

  getConfiguracionPersonalizada() {
    this.configuracioncvService.getConfiguracionesPersonalizadas().subscribe(
      res => {
        this.configuracioncvService.configuracionesPersonalizadas = res;
        console.log("getConfiguracionPersonalizada",res);
      },
      err => console.log(err)
    )
  }

  getConfiguracion() {
    this.configuracioncvService.getConfiguraciones().subscribe(
      res => {
        this.configuracioncvService.configuraciones = res;
        // this.configuracioncvService.configuracionesPersonalizadas = data;

        const filteredCategories = [];
        res.forEach(configuracion => {
          if (!filteredCategories.find(cat => cat.bloque == configuracion.bloque && cat.atributo == configuracion.atributo)) {
            const { id, bloque, atributo, ordenCompleto, mapeo,visible_cv_completo } = configuracion;
            filteredCategories.push({ id, bloque, atributo, ordenCompleto, mapeo, visible_cv_completo });
          }
         
        });
        console.log('getConfiguracion', filteredCategories)
        
        this.configuracioncvService.configuraciones = filteredCategories;
        this.arregloAtributos = filteredCategories;
        console.log("this.arregloAtributos->>>>>>>>>>>>>>>>AAAAAAA", this.arregloAtributos)

        this.arregloBloquesConfiguracion = filteredCategories.reduce(function (r, a) {
          r[a.bloque] = r[a.bloque] || [];
          r[a.bloque].push(a);
          return r;
        }, Object.create(null));


        console.log('BLOQUES', this.arregloBloquesConfiguracion);
      },
      err => console.log(err)
    )
  }

  // getBloques() {
  //   this.configuracioncvService.getBloques()
  //     .subscribe(res => {
  //       this.configuracioncvService.bloques = res;
  //       console.log('BLOQUESRESTAPI', res)
  //     })
  // }

  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.arregloBloques = res
        let atributosOrdenados = _.orderBy(this.arregloBloques,['ordenPersonalizable', ], ['asc'])
        this.arregloBloques = atributosOrdenados
        console.log("🚀 ~ file: personalizado-cv.component.ts ~ line 188 ~ PersonalizadoCvComponent ~ getBloques ~ atributosOrdenados", this.arregloBloques)
        
        this.dataSource = new MatTableDataSource(this.arregloBloques);
        // this.selection = new SelectionModel<Bloque>(true, []);
        this.dataSource.paginator = this.paginator;
        this.bloquesOriginal = JSON.parse(
          JSON.stringify(this.arregloBloques)
        );
      });
  }

  editBloque(bloque: Bloque){
    this.configuracioncvService.putBloque(bloque).subscribe
      (res =>{
        console.log('SEDITABLOQUE', res)
        this._snackBar.open('Guardado Correctamente', "Cerrar", {
          duration: 2000,
        });
      })
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

  // guardar() {
  //   // iterar cada uno de los bloques
  //   this.arregloBloques.forEach((bloque) => {
  //     // para eficiencia se puede comprobar si el registro actual (bloque)
  //     // se ha modificado. Si sus campos son iguales al original entonces
  //     // no es necesario guardarlo
  //     console.log(bloque)
  //     let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
  //     if(bloqueOriginal.ordenPersonalizable == bloque.ordenPersonalizable) return

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

  guardar() {
    // iterar cada uno de los bloques
    console.log(this.nombre_cv)
    this.arregloBloques.forEach((bloque) => {
      // const data = {
      //   configuracionId: 1,
      //   id_user: 2,
      //   bloque: bloque.nombre,
      //   atributo: bloque.atributo,
      //   orden: bloque.ordenPersonalizable,
      //   visible_cv_personalizado: bloque.visible_cv_bloque,
      //   mapeo: bloque.atributo,
      //   cv: 2,
      //   nombre_cv: "this.form.value.nombrecv",
      //   cedula: "123"
      // }

      // this.miDataInterior.push(data);
      // console.log("configurac", this.miDataInterior);

      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      console.log(bloque)
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if(bloqueOriginal.ordenPersonalizable == bloque.ordenPersonalizable && 
        bloqueOriginal.visible_cv_bloqueCompleto == bloque.visible_cv_bloqueCompleto) return
        // console.log("guardado", bloque)
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


  guardarAtributos() {
    // iterar cada uno de los bloques
    let iduser =  localStorage.getItem("id_user");
    
    this.arregloAtributos.forEach((atributo) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      // console.log("atributo", atributo)
      let hash = Math.random().toString(36).substring(2);

      this.arregloBloques.forEach((bloque)=> {

        if (atributo.bloque === bloque.nombre) {
          console.log("SON IGUALES")
          const data = {
            // configuracionId: 1,
            // id_atributo: atributo.id,
            id_user: iduser,
            bloque: atributo.bloque,
            atributo: atributo.atributo,
            orden: atributo.orden,
            visible_cv_personalizado: atributo.visible_cv_completo,
            mapeo: atributo.mapeo,
            cv: hash,
            nombre_cv: this.nombre_cv,
            cedula: atributo.id,
            nombreBloque: bloque.nombre,
            ordenPersonalizable: bloque.ordenPersonalizable,
            visible_cv_bloque: bloque.visible_cv_bloqueCompleto
          }
          this.miDataInterior.push(data);
        } 
      });

      console.log("configurac", this.miDataInterior);
      

     
      // let atribtutoOriginal = this.atributosOriginal.find((b) => b.id == atributo.id);
      // if (atribtutoOriginal.orden == atributo.orden && atribtutoOriginal.mapeo == atributo.mapeo && atribtutoOriginal.visible_cv_completo == atributo.visible_cv_completo) return;

      // si el bloque se modificó proceder a guardarlo

      // console.log("AASDAS")
      // this.configuracioncvService
      //   .putConfiguracion(atributo)
      //   .subscribe((res) => {
      //     console.log("editado", res);
      //     this._snackBar.open("Se guardó  correctamente", "Cerrar", {
      //       duration: 2000,
      //     });
      //     this.getConfiguracion();
      //   });
    });
    console.log("DATAINTERIOR", this.miDataInterior)
    for (let i = 0; i < this.miDataInterior.length; i++) {
      let clave = this.miDataInterior[i];
      console.log('CLAVE', clave)
      this.configuracioncvService.postConfiguracionPersonalizada(clave)
        .subscribe(res => {
         
          console.log('SEGUARDO', res)
        });
        this._snackBar.open('Guardado Correctamente AA', "Cerrar", {
          duration: 2000,
        });
    }
    this.miDataInterior = [] 
  }

  guardarBloquesAtributos(){
    this.guardar();
    this.guardarAtributos();
    localStorage.setItem('nombre_cv', this.nombre_cv);
  }


  nombrecvLocalStorage(){
    localStorage.setItem('nombre_cv', this.nombre_cv);
  }
  // putConfiguracion(form: NgForm) {
  //   console.log('FORMULARIO FORMULARIO', form.value);
  //   if(form.value.id){
  //     this.configuracioncvService.putConfiguracion(form.value)
  //       .subscribe(
  //         res => console.log('CONFIACTUALIZAD',res)
  //       )
  //   }
  // }


  // getProduct(isVisible, bloque, atributo, mapeo){
  //   console.log('Nombrecv', this.form.value.nombrecv)
  //   console.log(isVisible, bloque, atributo, mapeo)

  //   // const configuracionPersonalizada = {
  //   //   idDocente: 1,
  //   //   bloque: bloque,
  //   //   atributo: atributo,
  //   //   visible_cv_personalizado: isVisible,
  //   //   mapeo: mapeo,
  //   //   cv: 1,
  //   //   nombre_cv: this.form.value.nombrecv
  //   // }
  //   // this.configuracioncvService.postConfiguracionPersonalizada(configuracionPersonalizada)
  //   //   .subscribe(res=>{
  //   //     console.log('SEGUARDA', res)
  //   //   })
  //   this.PostConfiguracionPersonalizada(isVisible, bloque, atributo, mapeo)
  // }

  // PostConfiguracionPersonalizada(isVisible, bloque, atributo, mapeo) {
  //   const configuracionPersonalizada = {
  //     idDocente: 1,
  //     bloque: bloque,
  //     atributo: atributo,
  //     visible_cv_personalizado: isVisible,
  //     mapeo: mapeo,
  //     cv: 1,
  //     nombre_cv: this.form.value.nombrecv
  //   };
  //   console.log('PARECEQUESEGUARD',configuracionPersonalizada)
  // }



}
