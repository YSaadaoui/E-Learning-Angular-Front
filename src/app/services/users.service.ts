import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  public checkIfEmailExists(email:string):Observable<boolean>{
    return this.http.get<boolean>(environment.backendHost+"/users?email="+email)
  }
}
