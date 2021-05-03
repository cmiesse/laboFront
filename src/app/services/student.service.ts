import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private API_URL ="http://localhost:8082/student";
  constructor(private client:HttpClient, private service:SessionService) { }

  getAllStudents():Observable<Student[]>{
    return this.client.get(this.API_URL, {
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Student[]>;
  }

  getStudentById(id:number):Observable<Student>{
    return this.client.get(this.API_URL+"/"+id, {
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Student>;
  }

  postStudent(student:Student):Observable<Student>{
    return this.client.post(this.API_URL,student, {
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Student>;
  }

  deleteStudent(id:number):Observable<Student>{
    return this.client.delete(this.API_URL+"/"+id+"/delete", {
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Student>;
  }
}
