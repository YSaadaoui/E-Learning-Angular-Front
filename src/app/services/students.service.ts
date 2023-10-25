import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Student } from '../model/student.model';
import { HttpClient } from '@angular/common/http';
import { PageResponse } from '../model/page.response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { }
  public searchStudents(keyword: string, currentPage: number, pageSize: number): Observable<PageResponse<Student>> {
    return this.http.get<PageResponse<Student>>(environment.backendHost + "/students?keyword=" + keyword + "&page=" + currentPage + "&size=" + pageSize);
  }

  public deleteStudent(studentId: number) {
    return this.http.delete(environment.backendHost + "/students/" + studentId);
  }

  public saveStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(environment.backendHost + "/students", student);
  }

  public loadStudentByEamil(email:string):Observable<Student>{
    return this.http.get<Student>(environment.backendHost+"/students/find?email="+email);
  }

  public updateStudent(student:Student,studentId:number):Observable<Student>{
    return this.http.put<Student>(environment.backendHost+"/students/"+studentId,student)
  }

}
