import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from '../model/login.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoggedUser } from '../model/logger-user.model';
import { Route, Router } from '@angular/router';
import { Instructor } from '../model/instructor.model';
import { InstructorsService } from './instructors.service';
import { StudentsService } from './students.service';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelperService=new JwtHelperService();
  user =new BehaviorSubject<LoggedUser | null>(null)
  tokenExpirationTimer:any;

  constructor(private http:HttpClient,private router:Router,private instructorService:InstructorsService,private studentService:StudentsService)  { }

  public login(User:LoginRequest):Observable<LoginResponse>{
    const formData=new FormData();
    formData.append('username',User.username);
    formData.append('password',User.password)
    return this.http.post<LoginResponse>(environment.backendHost+"/login",formData)
  }

  saveToken(jwtTokens:LoginResponse){
    const decodedAccessToken=this.jwtHelperService.decodeToken(jwtTokens.accessToken)
    // console.log(decodedAccessToken)
    const loggedUser=new LoggedUser(decodedAccessToken.sub,decodedAccessToken.roles,jwtTokens.accessToken,decodedAccessToken.exp,undefined,undefined);
    //console.log(loggedUser)
    this.user.next(loggedUser)
    this.autoLogout(this.getExpirationDate(decodedAccessToken.exp).valueOf()-new Date().valueOf())
    localStorage.setItem('userData',JSON.stringify(loggedUser));
    this.redirectLoggedInUser(decodedAccessToken,jwtTokens.accessToken)
  }
  redirectLoggedInUser(decodedToken:any,accessToken:string){
    if(decodedToken.roles.includes("Admin")) this.router.navigateByUrl("/courses")
    else if(decodedToken.roles.includes("Instructor"))
      this.instructorService.loadInstructorByEmail(decodedToken.sub).subscribe(instructor=>{
        const loggedUser=new LoggedUser(decodedToken.sub,decodedToken.roles,accessToken,this.getExpirationDate(decodedToken.exp),undefined,instructor)
        localStorage.setItem('userData',JSON.stringify(loggedUser));
        this.user.next(loggedUser);
        localStorage.setItem('userData',JSON.stringify(loggedUser));
        this.router.navigateByUrl("/instructor-courses/" + instructor.instructorId)
      })

      else if(decodedToken.roles.includes("Student"))
          this.studentService.loadStudentByEamil(decodedToken.sub).subscribe(student=>{
          const loggedUser=new LoggedUser(decodedToken.sub,decodedToken.roles,accessToken,this.getExpirationDate(decodedToken.exp),student,undefined)
          //console.log(decodedToken.exp)
          this.user.next(loggedUser);
          localStorage.setItem('userData',JSON.stringify(loggedUser));
          this.router.navigateByUrl("/student-courses/"+student.studentId);
      })

    }

    logOut(){
      localStorage.clear();
      this.user.next(null)
      this.router.navigate(['/'])
      if(this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer)
      }
      this.tokenExpirationTimer=null
    }

    autoLogin(){
        const userData: {
          username:string,
          roles:string[],
          _token:string,
          _expiration:Date,
          student:Student |undefined,
          instructor:Instructor |undefined
        } = JSON.parse(localStorage.getItem('userData')!);
        if(!userData)return;
        const loadedUser=new LoggedUser(userData.username,userData.roles,userData._token,new Date(userData._expiration),userData.student,userData.instructor)
        if(loadedUser.token){
          this.user.next(loadedUser)
          this.autoLogout(loadedUser._expiration.valueOf() - new Date().valueOf())
        }
     }
     refrechInstructor(instructor:Instructor){
      const userData: {
        username:string,
        roles:string[],
        _token:string,
        _expiration:Date,
        student:Student |undefined,
        instructor:Instructor |undefined
      } = JSON.parse(localStorage.getItem('userData')!);
      if(!userData)return;
      const loggedUser=new LoggedUser(userData.username,userData.roles,userData._token,new Date(userData._expiration),userData.student,instructor);
      this.user.next(loggedUser);
      localStorage.setItem('userData',JSON.stringify(loggedUser));
     }

     refrechStudent(student:Student){
      const userData: {
        username:string,
        roles:string[],
        _token:string,
        _expiration:Date,
        student:Student |undefined,
        instructor:Instructor |undefined
      } = JSON.parse(localStorage.getItem('userData')!);
      if(!userData)return;
      const loggedUser=new LoggedUser(userData.username,userData.roles,userData._token,new Date(userData._expiration),student,userData.instructor);
      if(loggedUser.token){
        this.user.next(loggedUser);
      }
      localStorage.setItem('userData',JSON.stringify(loggedUser));
     }

    getExpirationDate(exp:number){
      const date=new Date(0);
      date.setUTCSeconds(exp)
      return date;
    }

    autoLogout(expurationDuration:number){
      this.tokenExpirationTimer=setTimeout(()=>{
        this.logOut();
      },expurationDuration)
    }
}
