import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, throwError } from 'rxjs';
import { Course } from 'src/app/model/course.model';
import { Instructor } from 'src/app/model/instructor.model';
import { PageResponse } from 'src/app/model/page.response.model';
import { CoursesService } from 'src/app/services/courses.service';
import { InstructorsService } from 'src/app/services/instructors.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})

export class CoursesComponent implements OnInit {
  searchFormGroup!:FormGroup;
  courseFormGroup!:FormGroup;
  updateCourseFormGroup!:FormGroup;
  pageCourses$!:Observable<PageResponse<Course>>
  instructors$!:Observable<Array<Instructor>>
  currentPage:number=0;
  pageSize:number=5;
  errorMessage!:string;
  errorInstructorsMessage!:string;
  submitted:boolean=false;
  defaultInstructor!:Instructor
  constructor(private modalService: NgbModal,private fb:FormBuilder,private courseService:CoursesService,private instructorService:InstructorsService) {
  }

  ngOnInit(): void {
    this.searchFormGroup=this.fb.group({
      keyword:this.fb.control('')
    })
    this.courseFormGroup=this.fb.group({
      courseName:["",Validators.required],
      courseDuration:["",Validators.required],
      courseDescription:["",Validators.required],
      instructor:[null,Validators.required]
    })
    this.handleSearchCourses()
  }


  getModal(content: any) {
    this.submitted=false;
    this.fetchInstructors();
    this.modalService.open(content, {size: 'xl'})
    console.log("Hello world")
  }

  handleSearchCourses(){
    let keyword=this.searchFormGroup.value.keyword;
   this.pageCourses$=this.courseService.searchCourses(keyword,this.currentPage,this.pageSize).pipe(
    catchError(err=>{
      this.errorMessage=err.message;
      return throwError(err);
    })
   )
  }
  gotoPage(page:number){
    this.currentPage=page
    this.handleSearchCourses()
  }
  handleDeleteCourse(c:Course){
    let conf=confirm("are you sure")
    if(!conf) return;
    this.courseService.deleteCourse(c.courseId).subscribe({
      next:()=>{
        this.handleSearchCourses()
      },
      error:err=>{
        alert(err.message)
        console.log(err)
      }
  })
  }
  fetchInstructors(){
    this.instructors$=this.instructorService.findAllInstructors().pipe()
      catchError(err=>{
        this.errorInstructorsMessage=err.message;
        return throwError(err);
      })
  }

  onSaveCourse(modal:any){
    this.submitted=true
    console.log(this.courseFormGroup)
    if(this.courseFormGroup.invalid)return;
    this.courseService.saveCourse(this.courseFormGroup.value).subscribe({
      next:()=>{
        alert("Success Saving Course");
        this.handleSearchCourses();
        this.courseFormGroup.reset();
        this.submitted=false;
        modal.close();
      },error:err=>{
        alert(err.message)
      }
    })
  }
  onCloseModal(modal:any){
    modal.close();
    this.courseFormGroup.reset()
  }
  getUpdateModal(c:Course,updateContent:any){
    this.fetchInstructors();
    this.updateCourseFormGroup=this.fb.group({
      courseId:[c.courseId,Validators.required],
      courseName:[c.courseName,Validators.required],
      courseDuration:[c.courseDuration,Validators.required],
      courseDescription:[c.courseDescription,Validators.required],
      instructor:[c.instructor,Validators.required]
    })
    this.defaultInstructor=this.updateCourseFormGroup.controls['instructor'].value;
    this.modalService.open(updateContent,{size:'xl'})
  }
  onUpdateCourse(updateModal:any){
    this.submitted=true;
    console.log(this.updateCourseFormGroup)
    if(this.updateCourseFormGroup.invalid) return;
    this.courseService.updateCourse(this.updateCourseFormGroup.value,this.updateCourseFormGroup.value.courseId).subscribe({
      next:()=>{
        alert("success updating course");
        this.handleSearchCourses()
        this.submitted=false;
        updateModal.close();
      },error:err=>{
        alert(err.message)
      }
    })
  }
}
