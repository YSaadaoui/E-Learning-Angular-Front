import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule,Routes } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { StudentsComponent } from './components/students/students.component';
import { CoursesComponent } from './components/courses/courses.component';
import { TeachersComponent } from './components/teachers/teachers.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { CoursesInstructorComponent } from './components/courses-instructor/courses-instructor.component';
import { CoursesStudentComponent } from './components/courses-student/courses-student.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { AuthInterceptorService } from './services/auth.interceptor.service';
import { AuthGuardService } from './services/auth.guard.service';


const appRoutes: Routes = [
  { path: '', component: AuthenticationComponent },
  { path: 'students', component: StudentsComponent,canActivate: [AuthGuardService] },
  { path: 'courses', component: CoursesComponent ,canActivate: [AuthGuardService]},
  { path: 'teachers', component: TeachersComponent,canActivate: [AuthGuardService] },
  { path:'instructor-courses/:id',component:  CoursesInstructorComponent,canActivate: [AuthGuardService]},
  { path:'student-courses/:id',component:CoursesStudentComponent,canActivate: [AuthGuardService]},
  { path: 'navbar', component: NavbarComponent },
  { path: 'header', component: HeaderComponent },
  {path:'auth',component:AuthenticationComponent},

]

@NgModule({
  declarations: [
    AppComponent,
    StudentsComponent,
    CoursesComponent,
    TeachersComponent,
    NavbarComponent,
    HeaderComponent,
    CoursesInstructorComponent,
    CoursesStudentComponent,
    AuthenticationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {enableTracing: false}),
    DataTablesModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
