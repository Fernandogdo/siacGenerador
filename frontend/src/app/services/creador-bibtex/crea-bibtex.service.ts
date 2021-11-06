import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreaBibtexService {

  URL_BIBTEXT = 'http://localhost:8000/api/crea-bibtext/';

  constructor(private http: HttpClient) { }

  generaBibtex(id_user) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.get(this.URL_BIBTEXT + id_user, httpOptions);
  }
}
