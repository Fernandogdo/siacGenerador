export class Docente {
  constructor(
    public first_name: number,
    public last_name: string,
    public username: string,
    public password: number,
    public id_user?: string,
    public is_staff?:boolean
  ) {}
}
