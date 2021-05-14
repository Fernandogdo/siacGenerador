import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';

@Component({
  selector: 'app-edita-personalizado',
  templateUrl: './edita-personalizado.component.html',
  styleUrls: ['./edita-personalizado.component.css']
})
export class EditaPersonalizadoComponent implements OnInit {

  form: FormGroup;
  nombre_cv;
  ConfPersonalizadaNombre = [];

  constructor(
    public fb: FormBuilder,
    public configuracioncvService:ConfiguracioncvService,
    private route: ActivatedRoute,
  ) { 
    this.form = this.fb.group({
      nombre_cv: ['', Validators.required]
    })
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

  getConfiguracionPersonalizada() {
    this.configuracioncvService.getConfiguracionesPersonalizadas().subscribe(
      res => {
        this.configuracioncvService.configuracionesPersonalizadas = res;
        console.log('RESERVISE',res)
        const filteredCategories = [];
        res.forEach(configuracion => {
          if (!filteredCategories.find(cat => cat.bloque == configuracion.bloque && cat.atributo == configuracion.atributo)) {
            const { id, nombre_cv, bloque, atributo, orden, mapeo, fecha_registro, visible_cv_personalizado, idDocente } = configuracion;
            filteredCategories.push({ id, nombre_cv, bloque, atributo, orden, mapeo, visible_cv_personalizado, idDocente });
          }
        });

        this.configuracioncvService.configuracionesPersonalizadas = filteredCategories;
       
        console.log('FILTRANOMBRECV', filteredCategories);

        
        this.ConfPersonalizadaNombre = filteredCategories.filter(user => user.nombre_cv === this.nombre_cv)
        
        console.log('FILTRANOMBRECV', this.ConfPersonalizadaNombre);

        let oneAlimento;
        oneAlimento = this.ConfPersonalizadaNombre

        console.log('FILTRANOMBRECVFIL',  oneAlimento[0].bloque);

        this.form.patchValue({
          nombre_cv: oneAlimento[0].nombre_cv, 
        });
      },
      err => console.log(err)
    )
  }

}
