import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Professor } from '../models/professor.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private API_URL = "http://localhost:8082/prof";
  constructor(private client:HttpClient, private service:SessionService) { }

  getAllProfs():Observable<Professor[]>{
    return this.client.get(this.API_URL, {
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Professor[]>;
  }

  getProfById(id:number):Observable<Professor>{
    return this.client.get(this.API_URL+"/"+id,{
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Professor>
  }

  postProf(prof:Professor):Observable<Professor>{
    return this.client.post(this.API_URL,prof,{
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Professor>
  }

  updateProf(prof:Professor, id:number){
    return this.client.put(this.API_URL+"/"+id,prof,{
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Professor>
  }

  deleteProf(id:number):Observable<Professor>{
    return this.client.delete(this.API_URL+"/"+id+"/delete",{
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Professor>
  }
}
