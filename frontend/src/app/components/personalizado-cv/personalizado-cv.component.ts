import { sharedStylesheetJitUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';

@Component({
  selector: 'app-personalizado-cv',
  templateUrl: './personalizado-cv.component.html',
  styleUrls: ['./personalizado-cv.component.css']
})
export class PersonalizadoCvComponent implements OnInit {

  constructor(
    public configuracioncvService: ConfiguracioncvService,
  ) {

  }

  ngOnInit(): void {
    this.getConfiguracion()
  }

  getConfiguracion() {
    this.configuracioncvService.getConfiguraciones().subscribe(
      res => {
        this.configuracioncvService.configuraciones = res;
        console.log(res);
      },
      err => console.log(err)
    )
  }

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

    this.configuracioncvService.postConfiguracionPersonalizada(configuracionPersonalizada)
      .subscribe(res =>{
        console.log('GUARDADOPERSO',res)
      })
  }

  postConfiguracionPersonalizada(){

  }

}
