import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ConfiguracioncvService } from "app/services/configuracioncv.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as _ from "lodash";
import { Configuracioncv } from "app/models/configuracioncv.model";
import { ConfiguracioncvPersonalizado } from "app/models/configuracioncvPersonalizado.model";

@Component({
  selector: "app-edita-personalizado",
  templateUrl: "./edita-personalizado.component.html",
  styleUrls: ["./edita-personalizado.component.css"],
})
export class EditaPersonalizadoComponent implements OnInit, OnDestroy {
  formPersonalizado: FormGroup;
  nombre_cv;
  private _unsubscribeAll: Subject<any>;
  configuraciones: Configuracioncv[];
  configuracionesPersonalizadas: ConfiguracioncvPersonalizado[];
  configuracionesClas: any;
  miDataInterior = [];
  confPersonalizadaNombre = [];

  constructor(
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.nombre_cv = this.route.snapshot.params["nombre"];
    // console.log("NOMBREBLOQUE", this.nombre_cv);
    this.configuracioncvService.onConfiguracionesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((configuraciones) => {
        this.configuraciones = configuraciones;
        this.configuracionesClas = _.groupBy(configuraciones, "bloque");
      });
    this.configuracioncvService.onConfigPersonalizadasChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((configuracionesPersonalizadas) => {
        this.configuracionesPersonalizadas = configuracionesPersonalizadas;
        // console.log('personalizadas', this.configuracionesPersonalizadas[0].id)
      });
    this.formPersonalizado = this.addPropiedades();
  }

  addPropiedades() {
    const group = {};
    group["nombre_cv"] = new FormControl(this.nombre_cv, Validators.required);

    this.confPersonalizadaNombre = this.configuracionesPersonalizadas.filter(
      (data) => data.nombre_cv === this.nombre_cv
    );
    console.log("filtradonombre", this.confPersonalizadaNombre);

    this.configuraciones.forEach((arreglo: any, index) => {
      const seleccionado = this.confPersonalizadaNombre.find(
        (c) => c.configuracionId === arreglo.id
      );

      group[arreglo.id] = this.fb.group({
        valor: [seleccionado ? true : false],
        orden: [1],
        // bloque: bloque
      });
    });
    return new FormGroup(group);
  }

  guardar() {
    const form = this.formPersonalizado.getRawValue();
    console.log("FORM", form);
    const resultados = [];
    _.map(form, (element, key) => {
      if (element.valor !== false && key !== "nombre_cv") {
        // delete element.valor;
        resultados.push({
          configuracionId: key,
          // ...element,
          nombre_cv: this.nombre_cv,
          visible_cv_personalizado: element.valor,
        });
      }
    });
    console.log(
      "🚀 ~ file: edita-personalizado.component.ts ~ line 97 ~ EditaPersonalizadoComponent ~ guardar ~ resultados",
      resultados
    );
    this.postConfiguracionPersonalizada(resultados);
  }

  postConfiguracionPersonalizada(resultados) {
    const promesas = [];
    const data = [
      {
        configuracionId: 3,
        id: 1,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: false,
      },

      {
        configuracionId: 5,
        id: 2,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      {
        configuracionId: 7,
        id: 3,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      {
        configuracionId: 9,
        id: 5,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      {
        configuracionId: 11,
        id: 6,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      {
        configuracionId: 13,
        id: 7,
        idDocente: 1,
        nombre_cv: "data",
        orden: 1,
        visible_cv_personalizado: true,
      },

      // {configuracionId: 3, id: 2,
      // idDocente: 1, nombre_cv: "data", orden: 1,
      // visible_cv_personalizado: true}
    ];
    var iguales=0;
    for (let i = 0; i < data.length; i++) {
      // let clave = data[i];

      for (var j = 0; j < data.length; j++) {
        if (data[i] == resultados[j]) iguales++;
      }

      console.log(
        "🚀 ~ file: edita-personalizado.component.ts ~ line 98 ~ EditaPersonalizadoComponent ~ postConfiguracionPersonalizada ~ clave",
        iguales
      );

      // this.configuracioncvService
      //   .putConfiguracionPersonalizada(clave)
      //   .subscribe((res) => {
      //     console.log("SEEDITA", res);
      //   });
      // promesas.push(this.configuracioncvService
      //   .postConfiguracionPersonalizada(clave));
    }
    return Promise.all(promesas);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
