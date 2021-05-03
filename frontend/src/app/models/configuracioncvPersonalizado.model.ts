import { Administrador } from './administrador.model';


export class ConfiguracioncvPersonalizado {
    
    constructor(
        public idDocente: number,
        public bloque: string,
        public atributo: string,
        public orden: number,
        public visible_cv_personalizado: Boolean,
        public mapeo: string,
        public cv: string,
        public nombre_cv: string,
        public id?: string,

    ) {

    }



}
