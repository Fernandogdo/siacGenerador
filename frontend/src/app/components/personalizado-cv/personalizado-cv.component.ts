import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalPersonalizacionComponent } from '../modal-personalizacion/modal-personalizacion.component';

@Component({
  selector: 'app-personalizado-cv',
  templateUrl: './personalizado-cv.component.html',
  styleUrls: ['./personalizado-cv.component.css']
})
export class PersonalizadoCvComponent implements OnInit {

  form: FormGroup;

  dialogEditPersonalizacion: MatDialogRef<ModalPersonalizacionComponent>;

  bloque;
  atributo;
  orden;
  visible_cv_personalizado;
  mapeo;
  cv;
  nombre_cv;

  arregloBloques = [];

  constructor(
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    private dialog: MatDialog

  ) {
    this.form = this.fb.group({
      nombrecv: ['', Validators.required],
      orden: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    // this.getConfiguracionPersonalizada();
    this.getConfiguracion();
  }

  public showDiv(): boolean {
    const name = this.form.value.nombrecv;
    return !!name;
  }

  miDataInterior = [];

  //Agregar 
  agregar(visible: string, idSeleccionado, bloque: string, atributo: string, mapeo: string) {
    console.log(this.form.value.nombrecv)
   
    const data = {
      configuracionId: idSeleccionado,
      idDocente: 1,
      bloque: bloque,
      atributo: atributo,
      orden: 1,
      visible_cv_personalizado: visible,
      mapeo: mapeo,
      cv: 1,
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

        this.arregloBloques = filteredCategories.reduce(function (r, a) {
          r[a.bloque] = r[a.bloque] || [];
          r[a.bloque].push(a);
          return r;
        }, Object.create(null));


        console.log('BLOQUES', this.arregloBloques);
      },
      err => console.log(err)
    )
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

  ModalEditPersonalizacion(bloque, atributo, mapeo) {
    console.log("Bloque: ", bloque)
    console.log("Atributo ", atributo)
    console.log("Mapeo: ", mapeo)
    this.dialogEditPersonalizacion = this.dialog.open(ModalPersonalizacionComponent, {
      data: {
        bloque: bloque,
        atributo: atributo,
        mapeo: mapeo
      }
    });
    this.dialogEditPersonalizacion.afterClosed().subscribe(() => {
      this.getConfiguracionPersonalizada();
    });
  }

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
