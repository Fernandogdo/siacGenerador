import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';

@Component({
  selector: 'app-edita-personalizado',
  templateUrl: './edita-personalizado.component.html',
  styleUrls: ['./edita-personalizado.component.css']
})
export class EditaPersonalizadoComponent implements OnInit {

  form: FormGroup;
  nombre_cv;
  cv;
  ConfPersonalizadaNombre = [];
  arregloBloques = [];

  constructor(
    public fb: FormBuilder,
    public configuracioncvService: ConfiguracioncvService,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      nombre_cv: ['', Validators.required],
      // propiedad: ['']
      propiedades: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.nombre_cv = this.route.snapshot.params['nombre']
    console.log('NOMBREBLOQUE', this.nombre_cv);
    this.getConfiguracionPersonalizada();
  }

  public showDiv(): boolean {
    const name = this.form.value.nombre_cv;
    return !!name;
  }

  get propiedadForms() {
    return this.form.get("propiedades") as FormArray;
  }

  addPropiedades(arregloBloques:any[]) {
    arregloBloques.forEach((arreglo, index) => {
      const group = {};
      group[arreglo.id] = new FormControl(null);
      this.propiedadForms.push(new FormGroup(group));
    });
  }

  // addPropiedades() {
  //   this.arregloBloques.forEach(arreglo => {
  //     const propiedad = this.fb.group({
  //       valor: [""],
  //     });
  //     this.propiedadForms.push(propiedad);
  //   });
  // }

  miDataInterior = [];

  agregar(bloque: string, atributo: string, mapeo: string) {
    console.log(this.form.value.nombre_cv)
    console.log(this.form.value.propiedad)

    const data = {
      idDocente: 1,
      bloque: bloque,
      atributo: atributo,
      visible_cv_personalizado: this.form.value.visible_cv_personalizado,
      mapeo: mapeo,
      cv: 1,
      nombre_cv: this.form.value.nombre_cv
    }

    let conf = this.miDataInterior.push(data);
    console.log(conf);
  }

  quitar(atributo) {
    this.miDataInterior.splice(this.miDataInterior.indexOf(atributo), 1);
    console.log(this.miDataInterior)
  }

  getConfiguracionPersonalizada() {
    this.configuracioncvService.getConfiguraciones().subscribe(
      res => {
        this.configuracioncvService.configuraciones = res;
        console.log('RESERVISE', res)

        this.arregloBloques = res.reduce(function (r, a) {
          r[a.bloque] = r[a.bloque] || [];
          r[a.bloque].push(a);
          return r;
        }, Object.create(null));

        console.log('BLOQUESTODOS', this.arregloBloques);
                  this.addPropiedades(res);

        this.configuracioncvService.getConfiguracionesPersonalizadas()
          .subscribe(res => {
            this.configuracioncvService.configuracionesPersonalizadas = res;
            console.log('PERSONALIZADAS', res)

            this.ConfPersonalizadaNombre = res.filter(user => user.nombre_cv === this.nombre_cv)
            // this.ConfPersonalizadaNombre = res.filter(user => user.cv === this.cv);
            console.log('FILTRANOMBRECV', this.ConfPersonalizadaNombre);
            let oneAlimento;
            oneAlimento = this.ConfPersonalizadaNombre

            this.form.patchValue({
              nombre_cv: this.ConfPersonalizadaNombre[0].nombre_cv,
              // propiedad: this.ConfPersonalizadaNombre[1].visible_cv_personalizado,
            });
            
          });
    
      },
      err => console.log(err)
    )
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
}