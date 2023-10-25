import { Component, OnDestroy, OnInit } from '@angular/core';
import { data } from 'jquery';
import { Subscription } from 'rxjs';
import { LoggedUser } from 'src/app/model/logger-user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,OnDestroy {

  userSub!:Subscription;
  isAuthenticated=false
  isAdmin=false
  isInstructor=false
  isStudent=false

  instructorId:number|undefined
  studentId:number |undefined

  constructor(private authService:AuthService) { }


  ngOnInit(): void {
    this.userSub=this.authService.user.subscribe(data=>{
      this.isAuthenticated = !!data;
      if(!this.isAuthenticated){
        this.initializeState();
      }else if(!!data){
        this.setRole(data)
      }
    })
  }


  setRole(loggedUser:LoggedUser|null){
    if(loggedUser?.roles.includes("Admin")) this.isAdmin=true
    else if(!!loggedUser?.instructor){
      this.isInstructor=true;
      this.instructorId=loggedUser.instructor?.instructorId;
    }else if(!!loggedUser?.student){
      this.isStudent=true;
      this.studentId=loggedUser.student?.studentId;
    }
  }

  initializeState(){
    this.isAdmin=false
    this.isInstructor=false
    this.isStudent=false
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe()
  }


}



