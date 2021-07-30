import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { ModalPersonalizacionComponent } from '../modal-personalizacion/modal-personalizacion.component';
import { Bloque } from 'app/models/bloque.model';
import { AuthorizationService } from 'app/services/login/authorization.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from "lodash";

@Component({
  selector: 'app-personalizado-cv',
  templateUrl: './personalizado-cv.component.html',
  styleUrls: ['./personalizado-cv.component.css']
})
export class PersonalizadoCvComponent implements OnInit {

  arregloBloques = [];
  arregloBloquesConfiguracion = []
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
    // this.getConfiguracionPersonalizada();
    this.getConfiguracion();
    this.getBloques();
    this.id_user = localStorage.getItem("id_user");
    this.authorizationService.getOneUser(this.id_user)
      .subscribe(res =>{
      console.log("🚀 ~ file: personalizado-cv.component.ts ~ line 52 ~ PersonalizadoCvComponent ~ ngOnInit ~ res", res)
      this.data_user = res;
      })
  }

  public showDiv(): boolean {
    const name = this.form.value.nombrecv;
    return !!name;
  }

  miDataInterior = [];

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
          console.log('SEGUARDO', res)
        })
    }
  }

  getConfiguracionPersonalizada() {
    this.configuracioncvService.getConfiguracionesPersonalizadas().subscribe(
      res => {
        this.configuracioncvService.configuracionesPersonalizadas = res;
        console.log(res);
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
            const { id, bloque, atributo, mapeo } = configuracion;
            filteredCategories.push({ id, bloque, atributo, mapeo });
          }
         
        });
        console.log('asdsad', filteredCategories)

        this.configuracioncvService.configuraciones = filteredCategories;

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

  guardar() {
    // iterar cada uno de los bloques
    this.arregloBloques.forEach((bloque) => {
      // para eficiencia se puede comprobar si el registro actual (bloque)
      // se ha modificado. Si sus campos son iguales al original entonces
      // no es necesario guardarlo
      // console.log(bloque)
      let bloqueOriginal = this.bloquesOriginal.find(b => b.id == bloque.id)
      if(bloqueOriginal.ordenPersonalizable == bloque.ordenPersonalizable) return

      // si el bloque se modificó proceder a guardarlo
      this.configuracioncvService
        .putBloque(bloque)
        .subscribe((res) => {
          console.log("editado", res);
          this.getBloques();
        });
        this._snackBar.open("Se guardo correctamente", "Cerrar", {
          duration: 2000,
        });
    });
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
