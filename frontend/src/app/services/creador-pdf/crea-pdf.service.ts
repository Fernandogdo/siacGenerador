import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

// import { Prestamo } from '../models/prestamo.model';

@Injectable({
  providedIn: "root",
})
export class PdfService {
  URL_PDF_COMPLETO = "http://127.0.0.1:8000/api/pdf-completo/";
  URL_PDF_RESUMIDO = "http://127.0.0.1:8000/api/pdf-resumido/";
  URL_PDF_PERSONALIZADO = "http://127.0.0.1:8000/api/pdf-personalizado/";

  constructor(private http: HttpClient) {}

  generaPdfCompleto(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_PDF_COMPLETO + id_user, httpOptions);
  }

  generaPdfResumido(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.http.get(this.URL_PDF_RESUMIDO + id_user, httpOptions);
  }

  generaPdfPersonalizado(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_PDF_PERSONALIZADO + id_user, httpOptions);
  }
}
