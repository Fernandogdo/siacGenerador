import { Component, OnInit } from '@angular/core';
import { BloqueServicioService } from '../../services/servicios-bloque/bloque-servicio.service';
import { CreaBibtexService } from '../../services/creador-bibtex/crea-bibtex.service';
import { CreaCsvService } from '../../services/creador-csv/crea-csv.service';
import { CreaTxtService } from '../../services/creador-txt/crea-txt.service';


@Component({
  selector: 'app-descarga-informacion',
  templateUrl: './descarga-informacion.component.html',
  styleUrls: ['./descarga-informacion.component.css']
})
export class DescargaInformacionComponent implements OnInit {

  idUserStorage;
  blob: any;
  // valor = false;
  valor: boolean;
  valorNombre;
  tipoDocumento;
  bloquesServicio;

  constructor(
    private creatxtService: CreaTxtService,
    private creaCsvService: CreaCsvService,
    private creaBibtexService: CreaBibtexService,
    private bloqueServicioService: BloqueServicioService
  ) { }

  ngOnInit(): void {
    this.idUserStorage = localStorage.getItem("id_user");
    this.getServicios();
  }


  getServicios() {
    this.bloqueServicioService.getServicios().subscribe((res) => {
      this.bloquesServicio = res
    })
  }


  generaCsvInformacion(bloqueNombre, bloqueUrl) {
    this.valor = true;
    this.valorNombre = bloqueNombre;
    this.tipoDocumento = "CSV"

    let bloque = /^(\w+):\/\/([^\/]+)([^]+)$/.exec(bloqueUrl);
    var [, protocolo, servidor, path] = bloque;

    let bloqueService = []

    bloqueService = path.split('/', 4)

    bloqueService = bloqueService[3]

    this.creaCsvService.generaCsvInformacion(bloqueService, this.idUserStorage).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = bloqueService + "_informacion_csv.csv";
      link.click();
      this.valor = false;
    });
  }

  generaBibInformacion(bloqueNombre, bloqueUrl) {
    this.valor = true;
    this.valorNombre = bloqueNombre;
    this.tipoDocumento = "BibTex"

    let bloque = /^(\w+):\/\/([^\/]+)([^]+)$/.exec(bloqueUrl);
    var [, protocolo, servidor, path] = bloque;

    let bloqueService = []

    bloqueService = path.split('/', 4)

    bloqueService = bloqueService[3]

    this.creaBibtexService.generaInformacionBibTex(bloqueService, this.idUserStorage).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = bloqueService + "_informacion_bib.bib";
      link.click();
      this.valor = false;
    });
  }


  generaTxtInformacion(bloqueNombre, bloqueUrl) {
    this.valor = true;
    this.valorNombre = bloqueNombre;
    this.tipoDocumento = "TXT"

    let bloque = /^(\w+):\/\/([^\/]+)([^]+)$/.exec(bloqueUrl);
    var [, protocolo, servidor, path] = bloque;

    let bloqueService = []

    bloqueService = path.split('/', 4)

    bloqueService = bloqueService[3]

    this.creatxtService.txtInformacion(bloqueService, this.idUserStorage).subscribe((data: any) => {
      this.blob = new Blob([data as BlobPart], { type: 'text/plain' });
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = bloqueService + "_informacion_txt.txt";
      link.click();
      this.valor = false;
    });
  }
}
