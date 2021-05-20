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

  constructor(
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.nombre_cv = this.route.snapshot.params["nombre"];
    console.log("NOMBREBLOQUE", this.nombre_cv);
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
      });
    this.formPersonalizado = this.addPropiedades();
  }


  addPropiedades() {
    const group = {};
    group["nombre_cv"] = new FormControl(this.nombre_cv, Validators.required);
    const seleccionados = [
      { id: 1, usarioId: 2, configuracionId: 21 },
      { id: 1, usarioId: 2, configuracionId: 1 },
      { id: 1, usarioId: 2, configuracionId: 5 },
      { id: 1, usarioId: 2, configuracionId: 100 },
      { id: 1, usarioId: 2, configuracionId: 54 },
    ];
    this.configuraciones.forEach((arreglo: any, index) => {
      const seleccionado = seleccionados.find(
        (c) => c.configuracionId === arreglo.id
      );
      group[arreglo.id] = this.fb.group({
        valor: [seleccionado ? true : false],
        orden: [null],
      });
    });
    return new FormGroup(group);
  }

  guardar() {
    const form = this.formPersonalizado.getRawValue();
    const resultados = [];
    _.map(form, (element, key) => {
      if (element.valor !== false && key !== "nombre_cv") {
        delete element.valor;
        resultados.push({ id: key, ...element });
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
    for (let i = 0; i < resultados.length; i++) {
      let clave = resultados[i];
      console.log("🚀 ~ file: edita-personalizado.component.ts ~ line 98 ~ EditaPersonalizadoComponent ~ postConfiguracionPersonalizada ~ clave", clave)
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
