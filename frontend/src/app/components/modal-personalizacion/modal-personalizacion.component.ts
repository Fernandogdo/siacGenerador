import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracioncvPersonalizado } from 'app/models/configuracioncvPersonalizado.model';

@Component({
  selector: 'app-modal-personalizacion',
  templateUrl: './modal-personalizacion.component.html',
  styleUrls: ['./modal-personalizacion.component.css']
})
export class ModalPersonalizacionComponent implements OnInit {

  form: FormGroup;

  idConfiguracion;
  bloque;
  atributo;
  orden;
  visible_cv_personalizado;
  mapeo;
  cv;
  nombre_cv;
  description;

  configuracionPersonalizadaSelected;
  oneConfiguracion: any = [];;
  
  constructor(
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    // Reactive Form
    this.form = this.fb.group({
      // bloque: ['', Validators.required],
      // atributo: ['', Validators.required],
      visible_cv_personalizado:['', Validators.required],
      mapeo:['', Validators.required],
      cv:['', Validators.required],
      nombre_cv:['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.bloque = this.data.bloque
    console.log('BLOQUE:', this.bloque);
    this.atributo = this.data.atributo
    console.log('ATRIBUTO:', this.atributo);
    this.mapeo = this.data.mapeo
    console.log('MAPEO:', this.mapeo);
    // this.configuracionPersonalizadaSelected = this.idConfiguracion;
    // this.getConfiguracion(this.configuracionPersonalizadaSelected)
    // this.PostConfiguracionPersonalizada();

  }

  PostConfiguracionPersonalizada() {

    console.log("Selected item Id: ", this.bloque,this.atributo, this.mapeo); // You get the Id of the selected item here
    const configuracionPersonalizada = {
      idDocente: 1,
      bloque: this.bloque,
      atributo: this.atributo,
      // orden: selectedItem.orden,
      visible_cv_personalizado: this.form.value.visible_cv_personalizado,
      mapeo: this.mapeo,
      cv: this.form.value.cv,
      nombre_cv: this.form.value.nombre_cv
    };

    if (this.form.value.visible_cv_personalizado == true) {
      this.configuracioncvService.postConfiguracionPersonalizada(configuracionPersonalizada)
      .subscribe(res =>{
        console.log('GUARDADOPERSO',res)
      });
    } else{
      console.log('ERROR')
    }
    
  }

  // getConfiguracion(idConfiguracion){
  //   this.configuracioncvService.getConfiguracionPersonalizada(idConfiguracion)
  //     .subscribe(res => {
  //       this.oneConfiguracion = res as ConfiguracioncvPersonalizado[]
  //       this.form.patchValue({
  //         bloque: this.oneConfiguracion.bloque,
  //         atributo: this.oneConfiguracion.atributo,
  //         // orden: this.oneConfiguracion.orden,
  //         visible_cv_personalizado: this.oneConfiguracion.visible_cv_personalizado,
  //         mapeo: this.oneConfiguracion.mapeo,
  //         cv: this.oneConfiguracion.cv,
  //         nombre_cv: this.oneConfiguracion.nombre_cv
  //       });
       
  //     });
  //     // this.getCategories();
  // }

  editConfiguracion() {

    const data = {
      idDocente: 1,
      id: this.idConfiguracion,
      bloque: this.form.value.bloque,
      atributo: this.form.value.atributo,
      // orden: this.orden,
      visible_cv_personalizado: this.form.value.visible_cv_personalizado,
      mapeo: this.form.value.mapeo,
      cv: this.form.value.cv,
      nombre_cv: this.form.value.nombre_cv
    }

    this.configuracioncvService.postConfiguracionPersonalizada(data)
      .subscribe(res=> {
        console.log('SEGUARDO', res)
      })
      // .subscribe(res => {
      //   console.log(res);
      //   this._snackBar.open("Categoria Actualizada", "Cerrar", {
      //     duration: 2000,
      //   });
      //   this.getCategories();
      // });
  }

 
}
