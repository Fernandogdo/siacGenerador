import { Administrador } from './administrador.model';


export class ConfiguracioncvPersonalizado {
    
    constructor(
        public idDocente?: number,
        public bloque?: string,
        public atributo?: string,
        public orden?: number,
        public visible_cv_personalizado?: Boolean,
        public mapeo?: string,
        public cv?: string,
        public nombre_cv?: string,
        public fecha_registro?: Date,
        public cedula?: string,
        public id?: string,

    ) {
        this.idDocente = idDocente,
        this.bloque = this.bloque,
        this.atributo = this.atributo,
        this.orden = this.orden,
        this.visible_cv_personalizado = this.visible_cv_personalizado,
        this.mapeo = this.mapeo,
        this.cv = this.cv,
        this.nombre_cv = this.nombre_cv,
        this.fecha_registro = this.fecha_registro,
        this.cedula = this.cedula,
        this.id = this.id
    }
}