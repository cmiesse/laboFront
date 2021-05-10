import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Course } from '../models/course.model';
import { Professor } from '../models/professor.model';
import { CourseService } from '../services/course.service';
import { ProfessorService } from '../services/professor.service';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})
export class CoursComponent implements OnInit {
  coursList:Course[]=[];
  courseForm:FormGroup;
  updateForm:FormGroup;
  professorList:Professor[]=[];
  profSelected : Professor;
  courseDetails:Course;
  profDetails:Professor;
  toggleAddUpdate : boolean = false;
  constructor(builder:FormBuilder, private service:CourseService, private pService: ProfessorService) {
    this.courseForm = builder.group({
      "id":new FormControl(null, Validators.required),
      "name":new FormControl(null, Validators.required),
      "ects":new FormControl(null, Validators.required),
      "prof": new FormControl("-", Validators.required)
    });
    this.updateForm = builder.group({
      "id":new FormControl(null, Validators.required),
      "name":new FormControl(null, Validators.required),
      "ects":new FormControl(null, Validators.required),
      "prof": new FormControl("-", Validators.required)
    });
   }

  ngOnInit(): void {
    this.getAllCourses();
    this.getAllProfessor();
  }

  getAllCourses(){
    this.service.getAllCourses().subscribe(
      (response) => {this.coursList = response},
      (error)=>console.log(error)
    )
  }

  getAllProfessor(){
    this.pService.getAllProfs().subscribe(
      (response)=>{this.professorList = response},
      (error)=>{console.log(error)}
    )
  }

  getCourseDetails(course:Course){
    if(this.courseDetails != null &&course.id == this.courseDetails.id){
      this.courseDetails = null;
      this.profDetails = null;
    } else{
      this.profDetails = null;
      this.service.getCourseById(course.id).subscribe(
        (response)=>{this.courseDetails = response},
        (error)=>console.log(error)
      )
    }
  }

  getProfDetails(prof:Professor){
    if(this.profDetails != null &&prof.id == this.profDetails.id){
      this.profDetails = null;
    } else{
      this.pService.getProfById(prof.id).subscribe(
        (response)=>{this.profDetails = response},
        (error)=>console.log(error)
      )
    }
  }

  postCourse(){
    if(this.courseForm.valid){
      var courseToAdd;
      this.pService.getProfById(this.courseForm.value.prof).subscribe((value)=>{this.profSelected = value,courseToAdd = {
      id:this.courseForm.value.id,
      name:this.courseForm.value.name,
      ects:this.courseForm.value.ects,
      prof: this.profSelected
    }, this.service.postCourse(courseToAdd).subscribe((value)=>{this.coursList.push(value), this.getAllCourses()})
    });
  }       
  }

  getUpdateFormReady(course:Course){
    this.updateForm.setValue({
      id:course.id,
      name:course.name,
      ects:course.ects,
      prof:course.prof.id
    });
    console.log(this.updateForm.value);
    this.toggleAdder();
  }

  update(){
    if(this.updateForm.valid){
      var courseToUpdate = {
        id:this.updateForm.value.id,
        name:this.updateForm.value.name,
        ects:this.updateForm.value.ects,
        prof: this.profSelected
      }
      this.service.updateCourse(courseToUpdate.id,courseToUpdate).subscribe((response)=>{console.log("Modification effectuée"), this.getAllCourses(),this.toggleAdder()});
    }
  }

  toggleAdder(){
    this.toggleAddUpdate = !this.toggleAddUpdate;
  }

  deleteCourse(course:Course){
    var r = confirm("Êtes-vous sûr de vouloir supprimer le cours ?");
    if(r == true){
      this.service.deleteCourse(course.id).subscribe((response)=>{
        console.log(response.name+" a été supprimé"), this.getAllCourses()
        
      })
      
      
    } else{
      console.log("Annulation");
      
    }
  }
}
