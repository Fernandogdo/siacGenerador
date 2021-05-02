
import { Configuracioncv } from './../../models/configuracioncv.model';
import { ProyectosService } from './../../services/proyectos.service';

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { LibrosService } from '../../services/libros.service';
import { ArticulosService } from './../../services/articulos.service';
import { ConfiguracioncvService } from './../../services/configuracioncv.service';

import { HttpClient } from "@angular/common/http";

import { NgForm } from '@angular/forms'
// import { jsPDF } from "jspdf";
// import jsPDF from 'jspdf';

import { jsPDF } from 'jspdf';
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
    },
    {
      "id": 7,
      "name": "Leanne Graham",
      "email": "sincere@april.biz",
      "phone": "1-770-736-8031 x56442"
    },
    {
      "id": 8,
      "name": "Ervin Howell",
      "email": "shanna@melissa.tv",
      "phone": "010-692-6593 x09125"
    },
    {
      "id": 9,
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
      "id": 10,
      "name": "Chelsey Dietrich",
      "email": "lucio@annie.ca",
      "phone": "(254)954-1289"
    },
    {
      "id": 11,
      "name": "Mrs. Dennis",
      "email": "karley@jasper.info",
      "phone": "1-477-935-8478 x6430"
    },
    {
      "id": 12,
      "name": "Leanne Graham",
      "email": "sincere@april.biz",
      "phone": "1-770-736-8031 x56442"
    },

  ];

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
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    // this.getLibros()
    // this.getArticulos()
    // this.getProyectos();
    this.getEsquemas();
    // this.getAtributos();
    this.postBLoque()
    // console.log(this.model)
    this.getConfiguracion();

  }


  resefForm(form:NgForm){
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
    if(form.value.id){
      this.configuracioncvService.putConfiguracion(form.value)
        .subscribe(
          res => console.log('CONFIACTUALIZAD',res)
        )
    }
  }


  deleteConfiguracion(id:string) {
    // if (confirm('Estás seguro de querer eliminar?')){

    // }

    this.configuracioncvService.deleteConfiguracion(id)
      .subscribe(res => {
        this.getConfiguracion()
      },
        
        
        err => console.error(err)
        
      );

  }

  editConfiguracion(configuracion: Configuracioncv){
    this.configuracioncvService.selectedConfiguracion = configuracion;
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
      this.esquemas.forEach((datos) => console.log(datos[0]));
      // this.esquemas.forEach(element => {
      //   this.esquemas = element[0]

      // });

      this.claves = Object.keys(lala);
      let keys = Object.keys(lala)
      console.log('claves', this.claves)
      for (let i = 0; i < keys.length; i++) {
        let clave = keys[i];
        console.log('DATA', lala[clave]);
      }

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


  postConfiguracion() {

    const configuracioncv = {
      administrador: 1,
      bloque: 'data',
      atributo: 'data',
      orden: 2,
      visible_cv_resumido: true,
      visible_cv_completo: true,
      mapeo: 'data'
    }

    this.configuracioncvService.createConfigracioncv(configuracioncv)
      .subscribe((nuevaconfiguracion) =>
        console.log(nuevaconfiguracion));
  }


  postBLoque() {

    this.configuracioncvService.getJSON().subscribe(data => {
      // let array = data.components.schemas
      // this.claves = Object.keys(array);
      // console.log('sadsadsa', this.claves)
      // let objeto = Object.assign({}, this.claves);
      // console.log(objeto)
      // this.claves = Object.keys(data.components.schemas);
      // let lala = data.components.schemas
      // this.claves = Object.keys(lala);

      // let json = JSON.stringify(data.components.schemas)
      // console.log('JSONSTRING', json)



      // this.configuracioncvService.postBloques(JSON.stringify(array))
      //   .subscribe(res => console.log(res))




      // console.log(this.claves)

      // console.log('claves', data.components.schemas)

      // for (let clave in objeto){
      //   console.log(objeto[clave]);
      //   this.configuracioncvService.postBloques(objeto[clave])
      //   .subscribe((res)=> {
      //     console.log('RESPUESTASERV',res)
      //   })
      // }


      // for (let bloque of this.claves) {

      //   console.log('FORFOR', bloque)
      //   this.configuracioncvService.postBloques(bloque)
      //     .subscribe((res) =>
      //       console.log('FORFOR', res)
      //     );
      // }
    });
    // const bloque = {
    //   nombre: 'data',
    //   orden: 1,
    // }





    // this.configuracioncvService.postBloques(bloque)
    //   .subscribe((bloque)=> 
    //   console.log('BLOQUE',bloque));
  }

  // public openPDF(): void {
  //   let DATA = document.getElementById('htmlData');

  //   html2canvas(DATA).then(canvas => {

  //     let fileWidth = 208;
  //     let fileHeight = canvas.height * fileWidth / canvas.width;

  //     var totalPDFPages = Math.ceil( $(".htmlData").width() / $(".htmlData").height()) - 1;

  //     const FILEURI = canvas.toDataURL('image/png')
  //     let PDF = new jsPDF('p', 'mm', 'a4');
  //     let position = 0;
  //     PDF.addImage(FILEURI, 'PNG', 15, position, fileWidth, fileHeight)


  //     for (var i = 1; i <= totalPDFPages; i++) {
  //       pdf.addPage(PDF_Width, PDF_Height);
  //       pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
  //     }

  //     PDF.addPage()

  //     PDF.text('ssad', 20, 20);
  //     PDF.save('angular-demo.pdf');


  //   });
  // }


  // public getPDF() {

  //   var HTML_Width = $("#htmlData").width();
  //   var HTML_Height = $("#htmlData").height();
  //   var top_left_margin = 10;
  //   var PDF_Width = HTML_Width + (top_left_margin * 2);
  //   var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 1.5);
  //   var canvas_image_width = HTML_Width;
  //   var canvas_image_height = HTML_Height;

  //   var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;


  //   html2canvas($("#htmlData")[0], { allowTaint: true }).then(function (canvas) {
  //     canvas.getContext('2d');

  //     console.log(canvas.height + "  " + canvas.width);
  //     var options = {
  //       pagesplit: true,
  //     };

  //     var imgData = canvas.toDataURL("image/jpeg", 1.0);
  //     var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
  //     pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);


  //     for (var i = 1; i <= totalPDFPages; i++) {
  //       pdf.addPage('5', 'portrait',);
  //       pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);


  //     }

  //     pdf.save("HTML-Document.pdf");
  //   });
  // }

  // getPDF() {


  //   //get table html
  //   const data = this.htmlData.nativeElement;
  //   //html to pdf format
  //   var html = htmlToPdfmake(data.innerHTML);

  //   const documentDefinition = { 
  //     content: html, 
  //     width:1300,
  //     // margin:[10,10,10,10]
  //   };
  //   pdfMake.createPdf(documentDefinition).download("Score_Details.pdf");


  // }

  public getPDF() {

    //get table html
    const data = this.htmlData.nativeElement;
    //html to pdf format
    var html = htmlToPdfmake(data.innerHTML);

    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).download();


  }

  // async getPDF() {
  //   const data = this.htmlData.nativeElement;

  //   let docDefinition = {
  //     content: [
  //       {
  //         image: await this.getBase64ImageFromURL(
  //           "https://images.pexels.com/photos/209640/pexels-photo-209640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300"
  //         ),
  //         width: 100,
  //         text: 'PDF Generated with Image from external URL',
  //       },
  //       // {
  //       //   text: 'PDF Generated with Image from external URL',
  //       //   fontSize: 20
  //       // },

  //     ]
  //   };

  //   pdfMake.createPdf(docDefinition).download('CV.pdf');
  // }


  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  // public getPDF() {
  //   //get table html
  //   const data = this.htmlData.nativeElement;
  //   //html to pdf format
  //   var html = htmlToPdfmake(data.innerHTML);


  //   html2canvas($("#htmlData")[0], { allowTaint: true }).then(function (canvas) {
  //     canvas.getContext('2d');
  //     var imgData = canvas.toDataURL("image/png");
  //     // var data = canvas.toDataURL();
  //     const docDefinition = {
  //       content: [{
  //         image: imgData,
  //         width: 500,
  //       }]
  //     };
  //     pdfMake.createPdf(docDefinition).download("Score_Details.pdf");


  //   });
  // }

}