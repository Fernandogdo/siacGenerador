import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvPersonalizado } from 'app/models/configuracioncvPersonalizado.model';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';
import { dataflow } from 'googleapis/build/src/apis/dataflow';


@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.component.html',
  styleUrls: ['./guardados.component.css']
})
export class GuardadosComponent implements OnInit {

  constructor(
    public configuracioncvService: ConfiguracioncvService
  ) { }

  arreglo = [];

  ngOnInit(): void {
    this.getConfiguracionPersonalizada()
  }

  getConfiguracionPersonalizada() {
    this.configuracioncvService.getConfiguracionesPersonalizadas()
      .subscribe(res => {
        let data = res.filter(data => data.visible_cv_personalizado === true)
        this.configuracioncvService.configuracionesPersonalizadas = data;

        const filteredCategories = [];
        data.forEach(configuracion => {
          if (!filteredCategories.find(cat => cat.nombre_cv == configuracion.nombre_cv && cat.atributo == configuracion.atributo)) {
            const { nombre_cv, bloque, atributo, visible_cv_personalizado } = configuracion;
            filteredCategories.push({ nombre_cv, bloque, atributo, visible_cv_personalizado });
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
}
