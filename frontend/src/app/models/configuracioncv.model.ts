import { Administrador } from "./administrador.model";

export class Configuracioncv {
  constructor(
    public administrador: number,
    public bloque: string,
    public atributo: string,
    public orden: number,
    public visible_cv_resumido: Boolean,
    public visible_cv_completo: Boolean,
    public mapeo: string,
    public id?: string
  ) {}
}
