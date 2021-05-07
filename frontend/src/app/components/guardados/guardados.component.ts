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

  Object = Object;
  arreglo = [];

  ngOnInit(): void {
    this.getConfiguracionPersonalizada()
  }

  data = {
    test: [
      {
        nombre_cv: "test",
        bloque: "Articulos",
        atributo: "titulo",
        visible_cv_personalizado: true
      }
    ],
    convocatoria: [
      {
        nombre_cv: "test",
        bloque: "Articulos",
        atributo: "id",
        visible_cv_personalizado: true
      },
      {
        nombre_cv: "test",
        bloque: "Articulos", 
        atributo: "titulo", 
        visible_cv_personalizado: true
      }
    ]
  }

  getConfiguracionPersonalizada() {
    //     const resultado=tiempos.filter(elem => elem.tiempos[1] && elem.tiempos[1].terminado===1);
    // console.log(resultado);
    this.configuracioncvService.getConfiguracionesPersonalizadas()
      .subscribe(res => {
        let data = res.filter(data => data.visible_cv_personalizado === true)
        this.configuracioncvService.configuracionesPersonalizadas = data;

        const filteredCategories = [];
        data.forEach(category => {
          if (!filteredCategories.find(cat => cat.nombre_cv == category.nombre_cv && cat.atributo == category.atributo)) {
            const { nombre_cv, bloque, atributo, visible_cv_personalizado } = category;
            filteredCategories.push({ nombre_cv, bloque, atributo, visible_cv_personalizado });
          }
        });

        this.configuracioncvService.configuracionesPersonalizadas = filteredCategories;

        // const result =[];
        this.arreglo = filteredCategories.reduce(function (r, a) {
          r[a.nombre_cv] = r[a.nombre_cv] || [];
          r[a.nombre_cv].push(a);
          return r;
        }, Object.create(null));

        // this.configuracioncvService.configuracionesPersonalizadas = this.arreglo;

        console.log('RESUKLTRESUKT', this.arreglo);
        let evilResponseProps = Object.keys(this.arreglo);
        console.log('LLAVES', evilResponseProps)


        // console.log('NOREPETIDOS', filteredCategories);
        // console.log('FILTRADO', data);
        // console.log(res);
      }),
      err => console.log(err);
  }
}
