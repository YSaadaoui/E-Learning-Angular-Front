import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { UsersService } from "../services/users.service";
import {map, Observable } from "rxjs";


export class EmailExistsValidator{
  static Validate(usersService:UsersService):AsyncValidatorFn{
    return (control:AbstractControl):Observable<ValidationErrors| null> =>{
      return usersService.checkIfEmailExists(control.value).pipe(
        map((result:boolean)=>result?{emailAlreadyExists:true}:null)
      )
    }
  }
}
