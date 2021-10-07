import { Administrador } from './administrador.model';


export class ConfiguracioncvPersonalizado {
    
    constructor(
        public configuracionId?: number,
        public id_user?: number,
        public bloque?: string,
        public atributo?: string,
        public orden?: number,
        public visible_cv_personalizado?: Boolean,
        public mapeo?: string,
        public cv?: string,
        public nombre_cv?: string,
        public fecha_registro?: Date,
        public cedula?: string,
        public ordenPersonalizable?: number,
        public id?: number,

    ) {
        this.configuracionId = configuracionId,
        this.id_user = id_user,
        this.bloque = this.bloque,
        this.atributo = this.atributo,
        this.orden = this.orden,
        this.visible_cv_personalizado = this.visible_cv_personalizado,
        this.mapeo = this.mapeo,
        this.cv = this.cv,
        this.nombre_cv = this.nombre_cv,
        this.fecha_registro = this.fecha_registro,
        this.cedula = this.cedula,
        this.ordenPersonalizable = this.ordenPersonalizable
        this.id = this.id
    }
}