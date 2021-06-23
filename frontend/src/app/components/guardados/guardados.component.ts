import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvPersonalizado } from 'app/models/configuracioncvPersonalizado.model';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import * as _ from "lodash";
import { ModalPersonalizacionComponent } from '../modal-personalizacion/modal-personalizacion.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InfoDocenteService } from 'app/services/info-docente/info-docente.service';
import { PdfService } from 'app/services/creador-pdf/crea-pdf.service';
import { Docente } from 'app/models/docente';
import { Usuario } from 'app/models/user';


@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.component.html',
  styleUrls: ['./guardados.component.css']
})
export class GuardadosComponent implements OnInit {

  arreglo = [];
  confPersoDocente;
  confPersoDocenteClas = [];
  docente: Usuario[];
  
  blob: any;
  pdfGenerado: any;
  
  dialogEditCategoria: MatDialogRef<ModalPersonalizacionComponent>;

  constructor(
    public configuracioncvService: ConfiguracioncvService,
    public infoDocenteService: InfoDocenteService,
    public pdfService: PdfService,
    private dialog: MatDialog
  ) { }

  

  ngOnInit(): void {
    this.getConfiguracionPersonalizada()
    this.getConfigurcionPersonalizadaDocente()
    this.infoDocente()
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
    // console.log("🚀 ~ file: guardados.component.ts ~ line 55 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ iduser", iduser)
    
    this.configuracioncvService.listaConfiguracionPersonalizadaDocente(iduser)
      .subscribe(confPersoDocente =>{
        this.confPersoDocente = confPersoDocente;
        this.confPersoDocenteClas = _.groupBy(confPersoDocente, "nombre_cv");
      // console.log("🚀 ~ file: guardados.component.ts ~ line 59 ~ GuardadosComponent ~ getConfigurcionPersonalizadaDocente ~ res",  this.confPersoDocenteClas)
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

  infoDocente(){
    this.infoDocenteService.getInfoDocente().subscribe(res=>{
       console.log('datadatadata--->>>>>>>',res )
       this.docente = res
      //  console.log('sadsadsada------>>>>',this.docente.cedula)
       
    })
  }

  generaPdfCompleto(){
    this.pdfService.generaPdfCompleto().subscribe((data) => {

      this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
    
      var downloadURL = window.URL.createObjectURL(data);
      window.open(downloadURL)

      // var link = document.createElement('a');
      // link.href = downloadURL;
      // link.download = "pdf-completo.pdf";
      // link.click();
    })
  }


  generaPdfResumido(){
    this.pdfService.generaPdfResumido(19).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
      var downloadURL = window.URL.createObjectURL(data);
      window.open(downloadURL)
      
      // var link = document.createElement('a');
      
      
      // link.href = downloadURL;
      // link.download = "pdf-resumido.pdf";
      // link.click();
    })
  }

  generaPdfPersonalizado(){
    this.pdfService.generaPdfPersonalizado(19).subscribe((data) => {
      this.blob = new Blob([data as BlobPart], {type: 'application/pdf'});
      var downloadURL = window.URL.createObjectURL(data);
      window.open(downloadURL)
    })
  }
}
