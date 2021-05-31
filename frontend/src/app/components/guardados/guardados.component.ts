import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvPersonalizado } from 'app/models/configuracioncvPersonalizado.model';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import * as _ from "lodash";
import { ModalPersonalizacionComponent } from '../modal-personalizacion/modal-personalizacion.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.component.html',
  styleUrls: ['./guardados.component.css']
})
export class GuardadosComponent implements OnInit {

  arreglo = [];
  confPersoDocente;
  confPersoDocenteClas = [];
  
  dialogEditCategoria: MatDialogRef<ModalPersonalizacionComponent>;

  constructor(
    public configuracioncvService: ConfiguracioncvService,
    private dialog: MatDialog
  ) { }

  

  ngOnInit(): void {
    this.getConfiguracionPersonalizada()
    this.getConfigurcionPersonalizadaDocente()
  }

  getConfiguracionPersonalizada() {
    this.configuracioncvService.getConfiguracionesPersonalizadas()
      .subscribe(res => {
        let data = res.filter(data => data.visible_cv_personalizado === true)
        this.configuracioncvService.configuracionesPersonalizadas = data;

        const filteredCategories = [];
        data.forEach(configuracion => {
          if (!filteredCategories.find(cat => cat.nombre_cv == configuracion.nombre_cv && cat.atributo == configuracion.atributo)) {
            const { id, nombre_cv, bloque, atributo, visible_cv_personalizado, mapeo, cv, id_user} = configuracion;
            filteredCategories.push({ id, nombre_cv, bloque, atributo, visible_cv_personalizado, mapeo, cv, id_user});
          }
        });

        this.configuracioncvService.configuracionesPersonalizadas = filteredCategories;

        this.arreglo = filteredCategories.reduce(function (r, a) {
          r[a.nombre_cv] = r[a.nombre_cv] || [];
          r[a.nombre_cv].push(a);
          return r;
        }, Object.create(null));

        console.log('RESUKLTRESUKT', this.arreglo);
      }),
      err => console.log(err);
  }

  getConfigurcionPersonalizadaDocente(){
    let iduser =  localStorage.getItem("id_user");
    console.log("🚀 ~ file: guardados.component.ts ~ line 55 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ iduser", iduser)
    
    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente =>{
        this.confPersoDocente = confPersoDocente;
        this.confPersoDocenteClas = _.groupBy(confPersoDocente, "nombre_cv");
      console.log("🚀 ~ file: guardados.component.ts ~ line 59 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ res",  this.confPersoDocenteClas)
      })
  }

  modalPdf(id){
    this.dialogEditCategoria = this.dialog.open(ModalPersonalizacionComponent, {
      data: {
        idCategoria: id,
      }
    });
    this.dialogEditCategoria.afterClosed().subscribe(()=> {
      // this.getCategories();
    });
  }
}
