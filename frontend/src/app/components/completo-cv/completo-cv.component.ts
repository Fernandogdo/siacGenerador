
import { Configuracioncv } from './../../models/configuracioncv.model';
import { ProyectosService } from './../../services/proyectos.service';

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { LibrosService } from '../../services/libros.service';
import { ArticulosService } from './../../services/articulos.service';
import { ConfiguracioncvService } from './../../services/configuracioncv.service';

import { HttpClient } from "@angular/common/http";

import { NgForm } from '@angular/forms'
import { ActivatedRoute, Params } from '@angular/router';
import { Bloque } from 'app/models/bloque.model';
// import { jsPDF } from "jspdf";
// import jsPDF from 'jspdf';

// import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';

// import esquemasiac from '../../../assets/esquema/esquemasiac.json'
// import * as data from '../../../assets/esquema/esquemasiac.json';

@Component({
  selector: 'app-completo-cv',
  templateUrl: './completo-cv.component.html',
  styleUrls: ['./completo-cv.component.css']
})
export class CompletoCvComponent implements OnInit {

  @ViewChild('htmlData') htmlData: ElementRef;

  PDF_Width;
  PDF_Height;
  data = {
    Articulos: [
      {
        bloque: "Articulos",
        atributo: "test",
        mapeo: "test"
      },
      {
        bloque: "Articulos",
        atributo: "titulo",
        mapeo: "titulo"
      }
    ],
    Libros: [
      {
        bloque: "Libros",
        atributo: "test",
        mapeo: "test"
      },
      {
        bloque: "Libros",
        atributo: "test",
        mapeo: "test"
      }
    ],

    lala: [
      {
        orden: 1,
        properties: [
          {
            bloque: "Libros",
            atributo: "test",
            mapeo: "test"
          },
          {
            bloque: "Libros",
            atributo: "test",
            mapeo: "test"
          }
        ]

      }
    ]

  }

  USERS = [
    {
      "id": 1,
      "name": "Leanne Graham",
      "email": "sincere@april.biz",
      "phone": "1-770-736-8031 x56442"
    },
    {
      "id": 2,
      "name": "Ervin Howell",
      "email": "shanna@melissa.tv",
      "phone": "010-692-6593 x09125"
    },
    {
      "id": 3,
      "name": "Clementine Bauch",
      "email": "nathan@yesenia.net",
      "phone": "1-463-123-4447",
    },
    {
      "id": 4,
      "name": "Patricia Lebsack",
      "email": "julianne@kory.org",
      "phone": "493-170-9623 x156"
    },
    {
      "id": 5,
      "name": "Chelsey Dietrich",
      "email": "lucio@annie.ca",
      "phone": "(254)954-1289"
    },
    {
      "id": 6,
      "name": "Mrs. Dennis",
      "email": "karley@jasper.info",
      "phone": "1-477-935-8478 x6430"
    }
  ]

  claves: any = [];
  esquemas: any = [];
  atributos_articulos: any = [];

  componentes: string[] = [];

  configuracioncv: any;
  // model: Configuracioncv = { id: 0, administrador: 1, bloque: '', atributo: '', orden: 3, visible_cv_resumido: false, visible_cv_completo: false, mapeo: '' }
  // products: any = (data as any).default;
  // data = Object.values(this.datos);

  Object = Object;


  constructor(
    private librosService: LibrosService,
    private articulosService: ArticulosService,
    private proyectosService: ProyectosService,
    public configuracioncvService: ConfiguracioncvService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // this.getLibros()
    // this.getArticulos()
    // this.getProyectos();
    this.getEsquemas();
    // this.getAtributos();
    // console.log(this.model)
    this.getConfiguracion();
    this.getBloques()
    
  }


  resefForm(form: NgForm) {
    form.reset();
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

  putConfiguracion(form: NgForm) {
    console.log('FORMULARIO FORMULARIO', form.value);
    if (form.value.id) {
      this.configuracioncvService.putConfiguracion(form.value)
        .subscribe(
          res => console.log('CONFIACTUALIZAD', res)
        )
    }
  }

  getBloques() {
    this.configuracioncvService.getBloques()
      .subscribe(res => {
        this.configuracioncvService.bloques = res;
        console.log('BLOQUESRESTAPI', res.sort())
      })
  }

  deleteConfiguracion(id: string) {
    // if (confirm('Estás seguro de querer eliminar?')){

    // }

    this.configuracioncvService.deleteConfiguracion(id)
      .subscribe(res => {
        this.getConfiguracion()
      },


        err => console.error(err)

      );

  }

  editConfiguracion(configuracion: Configuracioncv) {
    // this.configuracioncvService.selectedConfiguracion = configuracion;
    this.configuracioncvService.putConfiguracion(configuracion).subscribe
      (res => {
        console.log('SEDITACONFI', res);
      })
  }

  editBloque(bloque: Bloque){
    this.configuracioncvService.putBloque(bloque).subscribe
      (res =>{
        console.log('SEDITABLOQUE', res)
      })
  }

  getEsquemas() {
    this.configuracioncvService.getJSON().subscribe(data => {
      // this.datos= data.components.schemas
      let lala = data.components.schemas
      // console.log(data);
      this.esquemas = Object.entries(data.components.schemas);
      let array = Object.entries(data.components.schemas);
      // console.log(this.esquemas);
      // console.log('DATOSDA', this.esquemas)
      //this.esquemas.forEach((datos) => console.log(datos[0]));
      // this.esquemas.forEach(element => {
      //   this.esquemas = element[0]

      // });

      // this.claves = Object.keys(lala);
      // let keys = Object.keys(lala)
      // console.log('claves', this.claves)
      // for (let i = 0; i < keys.length; i++) {
      //   let clave = keys[i];
      //   console.log('DATA', lala[clave]);
      // }

      // for (let index = 0; index < array.length; index++) {
      //   const element = array[index];
      //   console.log(element[0])
      // }

    });

  }


  getAtributos() {
    this.configuracioncvService.getJSON().subscribe(data => {
      // this.datos= data.components.schemas
      this.atributos_articulos = Object.entries(data.components.schemas.Articulos.properties);
      console.log('ARTICULOS', this.atributos_articulos)
    });
  }

  getLibros() {
    this.librosService.getLibros().subscribe(
      res => console.log(res),
      err => console.log(err)
    )

  }

  getArticulos() {
    this.articulosService.getArticulos().subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }

  getProyectos() {
    this.proyectosService.getProyectos().subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }

}