import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Global } from "../global/global";

// import { Prestamo } from '../models/prestamo.model';

@Injectable({
  providedIn: "root",
})
export class PdfService {

  public url:string;

  // URL_PDF_COMPLETO = "http://localhost:8000/api/pdf-completo/";
  // URL_PDF_RESUMIDO = "http://localhost:8000/api/pdf-resumido/"; 
  // URL_PDF_PERSONALIZADO = "http://localhost:8000/api/pdf-personalizado/";  

  constructor(private http: HttpClient) {
    this.url = Global.url;

  }

  generaPdfCompleto(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'pdf-completo/' + id_user, httpOptions);
  }

  generaPdfResumido(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.http.get(this.url + 'pdf-resumido/' + id_user, httpOptions);
  }

  generaPdfPersonalizado(id_user, nombre_cv, cv) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.url + 'pdf-personalizado/' + id_user + "/" + nombre_cv + "/" + cv,  httpOptions);
  }
}


