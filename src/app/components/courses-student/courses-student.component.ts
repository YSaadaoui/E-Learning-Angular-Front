import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { PageResponse } from 'src/app/model/page.response.model';
import { CoursesService } from 'src/app/services/courses.service';

@Component({
  selector: 'app-courses-student',
  templateUrl: './courses-student.component.html',
  styleUrls: ['./courses-student.component.css']
})
export class CoursesStudentComponent implements OnInit {


  studentId!:number;
  pageCourses!:Observable<PageResponse<Course>>
  pageOtherCourses!:Observable<PageResponse<Course>>
  currentPage:number=0;
  otherCourseCurrentPage:number=0;
  pageSize:number=5;
  otherCoursePageSize:number=5;
  errorMessage!:string;
  otherCoursesErrorMessage!:string;

  constructor(private route:ActivatedRoute,private courseService:CoursesService) { }

  ngOnInit(): void {
    this.studentId=this.route.snapshot.params['id'];
    this.handleSearchStudentCourses();
    this.handleSearchNonEnrolledInCourse();
  }

  handleSearchStudentCourses(){
   this.pageCourses= this.courseService.getCoursesByStudent(this.studentId,this.currentPage,this.pageSize).pipe(
    catchError(err=>{
      this.errorMessage=err.message;
      return throwError(err)
    })
   )
  }
  gotoPage(page:number){
    this.currentPage=page;
    this.handleSearchStudentCourses();
  }

  handleSearchNonEnrolledInCourse(){
    this.pageOtherCourses=this.courseService.getEnrolledInCoursesByStudent(this.studentId,this.otherCourseCurrentPage,this.otherCoursePageSize).pipe(
      catchError(err=>{
        this.errorMessage=err.message;
        return throwError(err)
      })
    )
  }

  gotoPageForOtherCourses(page:number){
    this.otherCourseCurrentPage=page;
    this.handleSearchNonEnrolledInCourse();
  }

  enrollIn(c:Course){
    this.courseService.enrollStudentInCourse(c.courseId,this.studentId).subscribe({
      next:()=>{
        this.handleSearchStudentCourses();
        this.handleSearchNonEnrolledInCourse();
      },error:err=>{
        alert(err.message);
        console.log(err)
      }
    })
  }
}
