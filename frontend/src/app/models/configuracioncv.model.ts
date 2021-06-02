import { Administrador } from "./administrador.model";

export class Configuracioncv {
  constructor(
    public administrador: number,
    public bloque: string,
    public atributo: string,
    public orden: number,
    public visible_cv_resumido: boolean,
    public visible_cv_completo: boolean,
    public mapeo: string,
    public id?: string
  ) {}
}
