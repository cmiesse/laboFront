import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Course } from '../models/course.model';
import { Professor } from '../models/professor.model';
import { Section } from '../models/section.model';
import { CourseService } from '../services/course.service';
import { ProfessorService } from '../services/professor.service';
import { SectionService } from '../services/section.service';

@Component({
  selector: 'app-professeur',
  templateUrl: './professeur.component.html',
  styleUrls: ['./professeur.component.css']
})
export class ProfesseurComponent implements OnInit {
  professorList:Professor[]=[];
  selectedProf:Professor = null;
  needToAdd:boolean = false;
  profForm:FormGroup;
  updateForm:FormGroup;
  courseList:Course[]=[];
  selectedCourses:Course[]=[];
  detailsCourse:Course=null;
  sectionList:Section[]=[];
  selectedSection:Section;
  detailsSection:Section=null;
  toggleAddUpdate : boolean = false;
  constructor(private service:ProfessorService, private cService: CourseService, private sService:SectionService , builder:FormBuilder,) {
    this.profForm = builder.group({
      "name":new FormControl(null, Validators.required),
      "surname":new FormControl(null, Validators.required),
      "office": new FormControl(null, Validators.required),
      "email":new FormControl(null, Validators.required),
      "hireDate":new FormControl(null, Validators.required),
      "wage": new FormControl(null, Validators.required),
      "section":new FormControl("-", Validators.required)/*,
      "cours":new FormControl([])*/
    });
    this.updateForm= builder.group({
      "name":new FormControl(null, Validators.required),
      "surname":new FormControl(null, Validators.required),
      "office": new FormControl(null, Validators.required),
      "email":new FormControl(null, Validators.required),
      "hireDate":new FormControl(null, Validators.required),
      "wage": new FormControl(null, Validators.required),
      "section":new FormControl("-", Validators.required)/*,
      "cours":new FormControl(null)*/
    });
    
    
   }

  ngOnInit(): void {
    this.getAll();
    this.getAllCourses();
    this.getAllSections();
    
  }

   getAllSections(){
    this.sService.getAllSections().subscribe((response)=>this.sectionList = response)
  }

  getAllCourses(){
    this.cService.getAllCourses().subscribe((response)=>this.courseList = response)
  }

  getAll(){
    this.service.getAllProfs().subscribe(
      (response) => {this.professorList = response},
      (error)=>console.log(error)
    )
  }

  getProfDetails(prof:Professor){
    if(this.selectedProf != null && prof.id === this.selectedProf.id){
      this.selectedProf = null;
      this.detailsSection = null;
      this.detailsCourse = null;
    }
    else{
      this.detailsSection = null;
      this.detailsCourse = null;
      const id = prof.id;
      this.service.getProfById(id).subscribe(
      (response)=>{this.selectedProf = response, console.log(this.selectedProf)}
      
    )
    }
    
  }

  postProf(){
    console.log(this.profForm.value);
    /*
    this.profForm.value.cours.forEach(
        (e)=>this.cService.getCourseById(e).subscribe((response)=>this.selectedCourses.push(response))
    )
    */
    var profToAdd;
    this.sService.getSectionById(this.profForm.value.section).subscribe(
      (response)=>{this.selectedSection = response,
    profToAdd = {
      id:7,
      name:this.profForm.value.name,
      surname:this.profForm.value.surname,
      office: this.profForm.value.office,
      email:this.profForm.value.email,
      hireDate:this.profForm.value.hireDate,
      wage: this.profForm.value.wage,
      section:this.selectedSection/*,
      cours:this.selectedCourses*/
    },
    console.log(profToAdd),
    this.service.postProf(profToAdd).subscribe(
      (response)=>{this.professorList.push(response), this.profForm.reset({section:"-"}), this.selectedSection = null, this.selectedCourses=[]},
      (error)=>{console.log(error)}
    ) });

    
  }

  getUpdateFormReady(professor:Professor){
    var courses = [];
    professor.cours.forEach((c)=>courses.push(c.id))
    console.log(courses);
    
    this.updateForm.setValue({
      name: professor.name,
      surname:professor.surname,
      office:professor.office,
      email:professor.email,
      hireDate:professor.hireDate,
      wage:professor.wage,
      section:professor.section.id/*,
      cours:courses*/
    });
    console.log(this.updateForm.value);
    
    this.toggleAdder();
  }

  update(){

  }

  delete(professor:Professor){

    var r = confirm("Êtes-vous sûr de vouloir supprimer le professeur ?");
    if(r == true){
      this.service.deleteProf(professor.id).subscribe((response)=>{
        console.log(response.name+" a été supprimé"), this.getAll()
        
      })
      
      
    } else{
      console.log("Annulation");
      
    }

  }

  toggleAdder(){
    this.toggleAddUpdate = !this.toggleAddUpdate;
  }

  selectSection(section:Section){
    this.sService.getSectionById(section.id).subscribe(
      (response)=>{this.detailsSection = response});
  }

  selectCours(cours:Course){
    this.cService.getCourseById(cours.id).subscribe(
      (response)=>this.detailsCourse = response
    )
  }

}
