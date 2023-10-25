import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Instructor } from '../model/instructor.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageResponse } from '../model/page.response.model';

@Injectable({
  providedIn: 'root'
})
export class InstructorsService {

  constructor(private http:HttpClient) { }

  public searchInstructors(keyword:string,currentPage:number,pageSize:number):Observable<PageResponse<Instructor>>{
    return this.http.get<PageResponse<Instructor>>(environment.backendHost+"/instructors?keyword="+keyword+"&page="+currentPage+"&size="+pageSize);
  }

  public findAllInstructors():Observable<Array<Instructor>>{
    return this.http.get<Array<Instructor>>(environment.backendHost+"/instructors/all");
  }
  public deleteInstructor(instructorId:number){
    return this.http.delete(environment.backendHost+"/instructors/"+instructorId);
  }

  public saveInstructor(instructor:Instructor):Observable<Instructor>{
    return this.http.post<Instructor>(environment.backendHost+"/instructors",instructor);
  }
  public loadInstructorByEmail(email:string) :Observable<Instructor>{
    return this.http.get<Instructor>(environment.backendHost+"/instructors/find?email="+email);
  }
  public updateInstructor(instructor:Instructor,instructorId:number):Observable<Instructor>{
    return this.http.put<Instructor>(environment.backendHost+"/instructors/"+instructorId , instructor );
  }

}
