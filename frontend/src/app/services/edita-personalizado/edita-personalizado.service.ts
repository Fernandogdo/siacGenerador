import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { ConfiguracioncvService } from "../configuracioncv.service";

@Injectable({
  providedIn: "root",
})
export class EditaPersonalizadoService implements Resolve<any> {
  constructor(private configuracionService: ConfiguracioncvService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([
        // this.configuracionService.getConfiguracionesPromise(),
        // this.configuracionService.getConfiguracionesPersonalizadasPromise(),
      ]).then(() => {
        resolve();
      }, reject);
    });
  }
}
