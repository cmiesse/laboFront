import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Course } from '../models/course.model';
import { Section } from '../models/section.model';
import { Student } from '../models/student.model';
import { CourseService } from '../services/course.service';
import { SectionService } from '../services/section.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})
export class EtudiantComponent implements OnInit {
  studentList:Student[]=[];
  displayedStudents:Student[]=[];
  start:number=0;
  end:number=10;
  sectionList:Section[]=[];
  courseList:Course[]=[];
  studentForm:FormGroup;
  selectedSection:Section;
  selectedcourse:Course;
  studentDetails:Student;
  sectionDetails:Section;
  courseDetails:Course;
  constructor(builder:FormBuilder, private service:StudentService, private sService: SectionService, private cService:CourseService) {
    this.studentForm = builder.group({
      "firstname":new FormControl(null, Validators.required),
    "lastname":new FormControl(null, Validators.required),
    "birthdate":new FormControl(null, Validators.required),
    "login":new FormControl(null, Validators.required),
    "section":new FormControl("-", Validators.required),
    "result":new FormControl(null, Validators.required),
    "courseId":new FormControl("-", Validators.required)
    })
   }

  ngOnInit(): void {
    this.getAllStudents();
    this.getAllSections();
    this.getAllCourses();
  }

  getAllStudents(){
    this.service.getAllStudents().subscribe(
      (response) => {this.studentList = response},
      (error)=>console.log(error)
    )
  }

  getAllSections(){
    this.sService.getAllSections().subscribe(
      (response) => {this.sectionList = response},
      (error)=>console.log(error)
    )
  }

  getAllCourses(){
    this.cService.getAllCourses().subscribe(
      (response) => {this.courseList = response},
      (error)=>console.log(error)
    )
  }

  postStudent(){
    if(this.studentForm.valid){
      var studentToAdd;
      this.sService.getSectionById(this.studentForm.value.section).subscribe(
        (response)=>{this.selectedSection = response, studentToAdd ={
          id:this.studentList.length +1,
          firstname:this.studentForm.value.firstname,
          lastname:this.studentForm.value.lastname,
          birthdate:this.studentForm.value.birthdate,
          login:this.studentForm.value.login,
          section:this.selectedSection,
          result:this.studentForm.value.result,
          courseId:this.studentForm.value.courseId
        },console.log(studentToAdd) ,this.service.postStudent(studentToAdd).subscribe((response)=>{console.log("Etudiant " +response.firstname +" ajouté"),this.getAllStudents()},(error)=>console.log(error))}
      )

      
    }
  }

  getStudentDetails(student:Student){
    if(this.studentDetails != null && student.id == this.studentDetails.id){
      this.studentDetails = null;
      this.sectionDetails = null;
      this.courseDetails = null;
    } else{
      this.sectionDetails = null;
      this.courseDetails = null;
      this.service.getStudentById(student.id).subscribe(
        (response)=>{this.studentDetails = response, console.log(this.studentDetails)},
        (error)=>console.log(error)
      );
    }
  }

  getSectionDetails(section:Section){
    if(this.sectionDetails != null && section.id == this.sectionDetails.id){
      this.sectionDetails = null;
    } else{
      this.sectionDetails = null;
      this.sService.getSectionById(section.id).subscribe(
        (response)=> {this.sectionDetails = response},
        (error)=>console.log(error)
      )
    }

  }

  getCourseDetails(id:string){
    if(this.courseDetails != null && id == this.courseDetails.id){
      this.courseDetails = null;
    } else{
      this.courseDetails = null;
      this.cService.getCourseById(id).subscribe(
        (response)=> {this.courseDetails = response},
        (error)=>console.log(error)
      )
    }
  }

  deleteStudent(student:Student){
    var r = confirm("Êtes-vous sûr de vouloir supprimer l'étudiant' ?");
    if(r == true){
      this.service.deleteStudent(student.id).subscribe((response)=>{
        console.log(response.firstname+" a été supprimé"), this.getAllStudents()
        
      })
      
      
    } else{
      console.log("Annulation");
      
    }
  }


}
