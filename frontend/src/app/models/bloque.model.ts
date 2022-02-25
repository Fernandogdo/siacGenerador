export class Bloque {
    
    constructor(
    
        public nombre: string,
        public ordenCompleto: number,
        public ordenResumido: number,
        public nombreService: string,
        public ordenPersonalizable : number,
        public visible_cv_bloqueCompleto: Boolean,
        public visible_cv_bloqueResumido: Boolean,
        public id?: number,

    ) {

    }

}