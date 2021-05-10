import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Section } from '../models/section.model';
import { Student } from '../models/student.model';
import { SectionService } from '../services/section.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {
  sectionList:Section[]=[];
  studentList:Student[]=[];
  selectedStudents:Student[]=[];
  sectionForm: FormGroup;
  updateForm:FormGroup;
  sectionDetails:Section;
  studentDetails:Student;
  toggleAddUpdate:boolean=false;
  constructor(builder: FormBuilder,private service:SectionService, private sService:StudentService) {
    this.sectionForm = builder.group({
      "id":new FormControl(null, Validators.required),
      "name":new FormControl(null, Validators.required),
      "delegateId":new FormControl(null, Validators.required),
      "students":new FormControl([],Validators.required)
    });
    this.updateForm = builder.group({
      "id":new FormControl(null, Validators.required),
      "name":new FormControl(null, Validators.required),
      "delegateId":new FormControl(null, Validators.required),
      "students":new FormControl([],Validators.required)
    })
   }

  ngOnInit(): void {
    this.getAllSections();
    this.getAllStudents();
  }

  getAllSections(){
    this.service.getAllSections().subscribe(
      (response) => {this.sectionList = response},
      (error)=>console.log(error)
    )
  }

  getAllStudents(){
    this.sService.getAllStudents().subscribe(
      (response)=>{this.studentList = response}
    )
  }
  postSection(){
    if(this.sectionForm.valid){
      var sectionToAdd;
      console.log(this.sectionForm.value);
      this.sectionForm.value.students.forEach(element => {
        this.sService.getStudentById(element).subscribe((response)=>this.selectedStudents.push(response))
      }), setTimeout(()=>{sectionToAdd={
        id:this.sectionForm.value.id,
        name:this.sectionForm.value.name,
        delegateId:this.sectionForm.value.delegateId,
         students:this.selectedStudents
        },console.log(sectionToAdd),this.service.postSection(sectionToAdd).subscribe((response)=>{this.getAllSections(),this.sectionForm.reset()},
        (error)=>console.log(error))},500) ;
      
    }
  }

  getUpdateFormReady(section:Section){
    this.updateForm.setValue({
      id:section.id,
      name:section.name,
      delegateId:section.delegateId,
      students:[]
    });
    this.toggleAdder();
  }

  update(){
    if(this.updateForm.valid){
      var sectionToUpdate = {
        id:this.updateForm.value.id,
        name:this.updateForm.value.name,
        delegateId:this.updateForm.value.delegateId,
        students: []
      }
      this.service.updateSection(sectionToUpdate.id,sectionToUpdate).subscribe((response)=>{console.log("Modification effectuée"), this.getAllSections(),this.toggleAdder()});
    }
  }

  toggleAdder(){
    this.toggleAddUpdate = !this.toggleAddUpdate;
  }

  getSectionDetails(section:Section){
    if(this.sectionDetails != null && section.id == this.sectionDetails.id){
      this.sectionDetails = null;
      this.studentDetails = null;
    } else{
      this.studentDetails = null;
      this.service.getSectionById(section.id).subscribe(
        (response)=>{this.sectionDetails = response},
        (error)=>console.log(error)
      )
    }
  }

  getStudentDetails(student:Student){
    if(this.studentDetails != null && student.id == this.studentDetails.id){
      this.studentDetails = null;
    } else{
      this.studentDetails = null;
      this.sService.getStudentById(student.id).subscribe(
        (response)=>{this.studentDetails = response},
        (error)=>console.log(error)
      )
    }
  }

  deleteSection(section:Section){
    var r = confirm("Êtes-vous sûr de vouloir supprimer la section ?");
    if(r == true){
      this.service.deleteSection(section.id).subscribe((response)=>{
        console.log(response.name+" a été supprimé"), this.getAllSections()
        
      })
      
      
    } else{
      console.log("Annulation");
      
    }
  }
}
