import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const siac = 'https://sica.utpl.edu.ec/ws/schema?format=openapi-json';

    // const token:  string = localStorage.getItem('token');
    // let req = request;

    const token:  string = localStorage.getItem('token');
    let req = request;
    const pathArray = "http://localhost:8000//api/".split( '/' )
    var protocol = pathArray[0];
    var Host = pathArray[2];
    var url = protocol + '//' + Host;

    // http://localhost:8000/

    // if(token){
     
    //   // console.log("lalaURL", url)

    //   // console.log("TOKENEXISTE", request.url,  request.url.includes(url))
    //   if (request.url.includes(url)) 
    //   {
    //     req = request.clone( {
    //       setHeaders: {
    //         Authorization: `Token ${token}`
    //       }
    //     });
    //   }
     
    // } else{
    //   console.log("NOEXISTETOKEN")
    // }

    // if(token){
    //   if (request.url !== siac) {
    //     req = request.clone( {
    //       setHeaders: {
    //         Authorization: `Token ${token}`
    //       }
    //     });
    //   }
     
    // } else{
    //   console.log("NOEXISTETOKEN")
    // }
    
    return next.handle(req);
  }
}
