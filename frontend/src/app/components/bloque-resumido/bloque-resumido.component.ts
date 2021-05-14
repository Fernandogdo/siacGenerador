import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Bloque } from 'app/models/bloque.model';
import { Configuracioncv } from 'app/models/configuracioncv.model';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';

@Component({
  selector: 'app-bloque-resumido',
  templateUrl: './bloque-resumido.component.html',
  styleUrls: ['./bloque-resumido.component.css']
})
export class BloqueResumidoComponent implements OnInit {

  nombreBloque;
  arregloBloques = [];

  constructor(
    private route: ActivatedRoute,
    public configuracioncvService: ConfiguracioncvService
  ) { }

  ngOnInit(): void {
    this.nombreBloque = this.route.snapshot.params['nombre']
    console.log('NOMBREBLOQUE', this.nombreBloque);
    // this.filtrarBloques()
    this.getConfiguracion()
  }

  getConfiguracion() {
    this.configuracioncvService.getConfiguraciones().subscribe(
      res => {
        this.configuracioncvService.configuraciones = res;
        const filteredCategories = [];
        res.forEach(configuracion => {
          if (!filteredCategories.find(cat => cat.bloque == configuracion.bloque && cat.atributo == configuracion.atributo)) {
            const { id, bloque, atributo, orden, mapeo, visible_cv_completo, visible_cv_resumido, administrador } = configuracion;
            filteredCategories.push({ id, bloque, atributo, orden, mapeo, visible_cv_completo, visible_cv_resumido, administrador });
          }
        });

        this.configuracioncvService.configuraciones = filteredCategories;
        
        this.arregloBloques = filteredCategories.filter(user => user.bloque === this.nombreBloque)
        
        console.log('FILTRADOBLOQUE', this.arregloBloques);
      },
      err => console.log(err)
    )
  }

  editConfiguracion(configuracion: Configuracioncv) {
    // this.configuracioncvService.selectedConfiguracion = configuracion;
    this.configuracioncvService.putConfiguracion(configuracion).subscribe
      (res => {
        console.log('SEDITA', res);
      })
  }

}
