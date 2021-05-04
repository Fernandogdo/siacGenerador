import { sharedStylesheetJitUrl } from '@angular/compiler';
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

  constructor(
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    private dialog: MatDialog

  ) {
    this.form = this.fb.group({
      nombrecv: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getConfiguracionPersonalizada()
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

  // putConfiguracion(form: NgForm) {
  //   console.log('FORMULARIO FORMULARIO', form.value);
  //   if(form.value.id){
  //     this.configuracioncvService.putConfiguracion(form.value)
  //       .subscribe(
  //         res => console.log('CONFIACTUALIZAD',res)
  //       )
  //   }
  // }

  onSelect(selectedItem: any) {

    console.log("Selected item Id: ", selectedItem.bloque, selectedItem.atributo); // You get the Id of the selected item here
    const configuracionPersonalizada = {
      idDocente: 1,
      bloque: selectedItem.bloque,
      atributo: selectedItem.atributo,
      orden: selectedItem.orden,
      visible_cv_personalizado: true,
      mapeo: selectedItem.mapeo,
      cv: 1,
      nombre_cv: 'ssad'
    };

    // this.configuracioncvService.postConfiguracionPersonalizada(configuracionPersonalizada)
    //   .subscribe(res =>{
    //     console.log('GUARDADOPERSO',res)
    //   })
  }
  
  ModalEditPersonalizacion(id, articulo, atributo, orden ){
    this.dialogEditPersonalizacion = this.dialog.open(ModalPersonalizacionComponent, {
      data: {
        idConfPersonalizada: id,
        articulo: articulo,
        atributo: atributo,
        orden: orden
      }
    });
    this.dialogEditPersonalizacion.afterClosed().subscribe(()=> {
      this.getConfiguracionPersonalizada();
    });
  }

  postConfiguracionPersonalizada(){

  }



}
