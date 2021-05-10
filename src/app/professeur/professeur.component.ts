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
      "id":new FormControl(null, Validators.required),
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
    if(this.profForm.valid){
      console.log(this.profForm.value);
      var profToAdd;
      this.sService.getSectionById(this.profForm.value.section).subscribe(
        (response)=>{this.selectedSection = response,
      profToAdd = {
        id:this.professorList.length+1,
        name:this.profForm.value.name,
        surname:this.profForm.value.surname,
        office: this.profForm.value.office,
        email:this.profForm.value.email,
        hireDate:this.profForm.value.hireDate+"T00:00:00",
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
  }

  tranformDate(input:Date):string{
    const date = new Date(input)
    var year = date.getFullYear();
    var month = (date.getMonth()+1) < 10 ? "0"+ (date.getMonth()+1): (date.getMonth()+1);
    var day = date.getDate() < 10 ?"0"+(date.getDate()) :date.getDate();
    return year+"-"+month+"-"+day;
  }

  getUpdateFormReady(professor:Professor){
    //var courses = [];
    //professor.cours.forEach((c)=>courses.push(c.id))
    //console.log(courses);
    
    this.updateForm.setValue({
      id:professor.id,
      name: professor.name,
      surname:professor.surname,
      office:professor.office,
      email:professor.email,
      hireDate:this.tranformDate(new Date(professor.hireDate)),
      wage:professor.wage,
      section:professor.section.id/*,
      cours:courses*/
    });
    console.log(this.updateForm.value);
    
    this.toggleAdder();
  }

  update(){
    if(this.updateForm.valid){
      var profToUpdate = {
        id:this.updateForm.value.id,
        name:this.updateForm.value.name,
        surname:this.updateForm.value.surname,
        office:this.updateForm.value.office,
        email:this.updateForm.value.email,
        hireDate:this.updateForm.value.hireDate+"T00:00:00",
        wage:this.updateForm.value.wage,
        section:{
          id:this.updateForm.value.section,
          name:null,
          delegateId:null,
          students:[]
  
        },
        cours:[]
      }
      console.log(profToUpdate);
      this.service.updateProf(profToUpdate, profToUpdate.id).subscribe((response)=>{console.log("Modification effectuée"), this.updateForm.reset(), this.toggleAdder()})
    }
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
    if(this.detailsSection != null && section.id == this.detailsSection.id){
      this.detailsSection = null;
    } else{
      this.detailsSection = null;
      this.sService.getSectionById(section.id).subscribe(
        (response)=>{this.detailsSection = response});
    }
  }

  selectCours(cours:Course){
    if(this.detailsCourse != null && cours.id == this.detailsCourse.id){
      this.detailsCourse = null;
    } else{
      this.detailsCourse = null;
      this.cService.getCourseById(cours.id).subscribe(
        (response)=>this.detailsCourse = response
      )
    }
    
  }

}
