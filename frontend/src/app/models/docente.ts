export class Docente {
  constructor(
    public first_name: number,
    public last_name: string,
    public username: string,
    public password: number,
    public id_user?: number,
    public is_staff?:boolean
  ) {}
}
