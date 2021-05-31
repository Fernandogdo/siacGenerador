import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


// import { Prestamo } from '../models/prestamo.model';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private pdfMake: any;
  // private urlLogo: string = https://res.cloudinary.com/utpl/image/upload/v1616652063/LAB%20UTPL%20/institucional_color.jpg_q26zrj.jpg;

  URL_PDF = 'localhost:8000/api/vistapdf/'

  constructor(
    private http: HttpClient
  ) { 
   
  }

  getPdf(){
    return this.http.get(this.URL_PDF)
  }



  async loadPdfMaker() {
    if (!this.pdfMake) {
      pdfMake!.vfs = pdfFonts.pdfMake.vfs;
    }
  }

  private getBase64ImageFromURL(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  // async generatePdf(prestamo: Prestamo) {
  //   const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  //   const fechaDescargaTemp = new Date();
  //   const fechaDescargar = fechaDescargaTemp.toLocaleDateString('es-EC');


  //   const fechaSolicitudTem: Date = prestamo.fechaPres;
  //   const fechaSol = fechaSolicitudTem.toLocaleDateString('es-EC', options)

  //   const fechaDevTem: Date = prestamo.fechaDev;
  //   const fechaDev = fechaDevTem.toLocaleDateString('es-EC', options)

  //   await this.loadPdfMaker();

  //   const data: any = {
  //     content: [
  //       {
  //         width: 180,
  //         image: await this.getBase64ImageFromURL(this.urlLogo),
  //       },
  //       {
  //         text: 'LABORATORIOS UTPL',
  //         style: 'titulo'
  //       },
  //       {
  //         text: [
  //           { text: 'Estimado/a : ' }, { text: prestamo.usuario?.nombreApellido?.toUpperCase(), style: 'negrita' }
  //         ],
  //         margin: [0, 20],
  //       },
  //       {
  //         text: [
  //           {
  //             text: Reciba un cordial saludo, en esta oportunidad nos es grato dirigirnos a usted para informarle que la solicitud para el recurso: ,
  //             margin: [0, 18, 0, 10],
  //             alignment: 'justify'
  //           },
  //           {
  //             text: prestamo.recurso?.nombre.toUpperCase(), style: 'negrita', margin: [0, 18, 0, 10],
  //             alignment: 'justify'
  //           },
  //           {
  //             text:  ha sido, margin: [0, 18, 0, 10],
  //             alignment: 'justify',
  //           },
  //           {
  //             text:  aceptada, , style: 'negrita', margin: [0, 18, 0, 10],
  //             alignment: 'justify'
  //           },
  //           {
  //             text: acérquese a retirar el recurso., margin: [0, 22, 0, 4],
  //             alignment: 'justify'
  //           }
  //         ],
  //         margin: [0, 10],
  //         style: 'body'
  //       },
  //       {
  //         text: 'Detalles Préstamo',
  //         style: 'subheader',
  //         margin: [0, 10, 0, 4],
  //       },
  //       {
  //         columns: [
  //           [
  //             { text: 'Solicitante', style: 'header', margin: [0, 10] },
  //             {
  //               width: '*',
  //               ul: [
  //                 prestamo.usuario?.nombreApellido?.toUpperCase(),
  //                 prestamo.usuario?.email,
  //                 prestamo.usuario?.celular,
  //               ], alignment: 'justify',
  //             },],
  //           [
  //             { text: 'Docente', style: 'header', margin: [0, 10] },
  //             {
  //               width: '*',
  //               ul: [
  //                 prestamo.nombreDocente.toUpperCase(),
  //                 prestamo.emailDocente,
  //                 prestamo.telefonoDocente
  //               ], alignment: 'justify',
  //             }],
  //           [{ text: 'Recurso', style: 'header', margin: [0, 10] },
  //           {
  //             width: '*',
  //             ul: [
  //               prestamo.recurso?.nombre,
  //               prestamo.cantidad,
  //               prestamo.recurso?.laboratorio?.nombre.toUpperCase()
  //             ], alignment: 'justify',
  //           }],
  //         ]
  //       },

  //       { text: 'Préstamo', style: 'header', margin: [0, 10] },
  //       {
  //         text: [
  //           { text: 'Proyecto: ', style: 'negrita' }, { text: prestamo.nombreProyecto },
  //         ],
  //         margin: [0, 1],
  //       },
  //       {
  //         text: [
  //           { text: 'Descripión: ', style: 'negrita' }, { text: prestamo.descProyecto, alignment: 'justify' },
  //         ],
  //         margin: [0, 1],
  //       },
  //       {
  //         text: [
  //           { text: 'Solicitud: ', style: 'negrita' }, { text: fechaSol },
  //         ],
  //         margin: [0, 1],
  //       },
  //       {
  //         text: [
  //           { text: 'Devolución: ', style: 'negrita' }, { text: fechaDev },
  //         ],
  //         margin: [0, 1],
  //       },
  //       {
  //         text: [
  //           { text: 'Detalles: ', style: 'header', margin: [0, 10] },
  //           { text: prestamo.detallesPres, alignment: 'justify' }
  //         ], margin: [0, 12]
  //       },
  //       {
  //         text: [
  //           { text: 'Importante: ', style: 'negrita', margin: [0, 40] },
  //           { text: 'Leer los detalles del préstamo para informarse cómo le entregan el recurso para no tener inconvenientes al momento de la devolución.', alignment: 'justify' }
  //         ], margin: [0, 40]
  //       },
  //       {
  //         text: [
  //           { text: 'Nota: ', style: 'negrita' },
  //           { text: 'Este documento sirve como constancia del préstamo, por el cuál el solicitante tendrá que presentarlo para registrar la devolución.', alignment: 'justify' }
  //         ]
  //       },
  //       {
  //         columns: [
  //           {
  //             stack: [
  //               `San Cayetano Alto
  //                   Loja-Ecuador
  //                   Laboratorios UTPL
  //                   www.utpl.edu.ec
  //                   `,
  //             ],
  //             absolutePosition: { x: 45, y: 700 },
  //             fontSize: 8,
  //             alignment: 'justify'
  //           }
  //         ]
  //       }
  //     ],
  //     styles: {
  //       header: {
  //         fontSize: 14,
  //         bold: true
  //       },
  //       titulo: {
  //         fontSize: 20,
  //         bold: true,
  //         alignment: 'center'
  //       },
  //       subheader: {
  //         fontSize: 16,
  //         bold: true,
  //       },
  //       body: {
  //         fontSize: 13,
  //         alignment: 'justify'
  //       },
  //       jus: {
  //         alignment: 'justify'
  //       },
  //       quote: {
  //         italics: true
  //       },
  //       small: {
  //         fontSize: 8
  //       },
  //       tableExample: {
  //         margin: [0, 5, 0, 15],
  //       },
  //       tableHeader: {
  //         bold: true,
  //         fontSize: 13,
  //         color: 'black',
  //         alignment: 'center'
  //       },
  //       negrita: {
  //         bold: true
  //       }
  //     }
  //   }
  //   pdfMake.createPdf(data).download(fechaDescargar + '_' + prestamo.usuario?.nombreApellido);
  // }
  }
