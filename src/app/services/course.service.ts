import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private API_URL = "http://localhost:8082/course";
  constructor(private client:HttpClient, private service:SessionService) { }

  getAllCourses():Observable<Course[]>{
    return this.client.get(this.API_URL, {
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Course[]>;
  }

  getCourseById(id:string):Observable<Course>{
    return this.client.get(this.API_URL+"/"+id,{
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Course>
  }

  postCourse(course: Course){
    return this.client.post(this.API_URL,course,{
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Course>
  }

  updateCourse(id:string,course:Course){
    return this.client.put(this.API_URL+"/"+id,course,{
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as  Observable<Course>;
  }

  deleteCourse(id:string):Observable<Course>{
    return this.client.delete(this.API_URL+"/"+id+"/delete", {
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Course>;
  }
}
