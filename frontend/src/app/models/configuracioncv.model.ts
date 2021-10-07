import { Administrador } from "./administrador.model";

export class Configuracioncv {
  constructor(
    public administrador: number,
    public bloque: string,
    public atributo: string,
    public ordenCompleto: number,
    public ordenResumido: number,
    public visible_cv_resumido: boolean,
    public visible_cv_completo: boolean,
    public mapeo: string,
    public id?: string
  ) {}
}
