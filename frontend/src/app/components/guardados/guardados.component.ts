import { Component, OnInit } from '@angular/core';
import { ConfiguracioncvPersonalizado } from 'app/models/configuracioncvPersonalizado.model';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';


@Component({
  selector: 'app-guardados',
  templateUrl: './guardados.component.html',
  styleUrls: ['./guardados.component.css']
})
export class GuardadosComponent implements OnInit {

  constructor(
    public configuracioncvService: ConfiguracioncvService
  ) { }

  ngOnInit(): void {
    this.getConfiguracionPersonalizada()
  }


  getConfiguracionPersonalizada(){
//     const resultado=tiempos.filter(elem => elem.tiempos[1] && elem.tiempos[1].terminado===1);
// console.log(resultado);
    this.configuracioncvService.getConfiguracionesPersonalizadas()
      .subscribe(res=>{
        let data = res.filter(data => data.visible_cv_personalizado===true)
        this.configuracioncvService.configuracionesPersonalizadas = data ;
        // res = res.filter(data => data.visible_cv_personalizado===true)
        console.log('FILTRADO', data);
        // console.log(res);
      }),
      err => console.log(err);
  }
}
