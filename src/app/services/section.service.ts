import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Section } from '../models/section.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class SectionService {
  private API_URL = "http://localhost:8082/section";
  constructor(private client:HttpClient, private service:SessionService) { }

  getAllSections():Observable<Section[]>{
    return this.client.get(this.API_URL, {
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Section[]>;
  }

  getSectionById(id:number):Observable<Section>{
    return this.client.get(this.API_URL+"/"+id,{
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Section>
  }

  postSection(section:Section): Observable<Section>{
    return this.client.post(this.API_URL,section,{
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Section>
  }

  deleteSection(id:number):Observable<Section>{
    return this.client.delete(this.API_URL+"/"+id+"/delete", {
      headers:{
        'Authorization': this.service.getUserInfo().auth
      }
    }) as Observable<Section>;
  }
}
