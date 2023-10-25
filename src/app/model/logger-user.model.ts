import { Instructor } from './instructor.model';
import { Student } from './student.model';

export class LoggedUser {
  constructor(
    public username: string,
    public roles: string[],
    private _token: string,
    public _expiration: Date,
    public student: Student | undefined,
    public instructor: Instructor | undefined
  ) {}

  get token() {

    if(   !this._expiration || new Date(0)>this._expiration){
      console.log(new Date()+" *********"+this._expiration)
      return null;
    }

    return this._token;
  }
}
