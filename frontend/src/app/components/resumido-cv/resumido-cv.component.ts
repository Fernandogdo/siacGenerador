import { Component, OnInit } from '@angular/core';
import { Bloque } from 'app/models/bloque.model';
import { ConfiguracioncvService } from 'app/services/configuracioncv.service';


@Component({
  selector: 'app-resumido-cv',
  templateUrl: './resumido-cv.component.html',
  styleUrls: ['./resumido-cv.component.css']
})
export class ResumidoCvComponent implements OnInit {

  arregloBloques = [];
  
  constructor(
    public configuracioncvService: ConfiguracioncvService
  ) { }

  ngOnInit(): void {
    this.getBloques()
  }

  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.configuracioncvService.bloques = res;
        console.log('BLOQUESRESTAPI', res)
      })
  }

  editBloque(bloque: Bloque){
    this.configuracioncvService.putBloque(bloque).subscribe
      (res =>{
        console.log('SEDITABLOQUE', res)
      })
  }
}
