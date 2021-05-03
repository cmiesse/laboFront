import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm } from '../models/login.form';
import { UserInfo } from '../models/user-info.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private API_URL = "http://localhost:8082";

  constructor( private client: HttpClient ) { }

  login(form : LoginForm){
    let encryptedString = "Basic " + window.btoa(form.username+":"+form.password);
    let obs = this.client.get(this.API_URL+"/login", {
      headers: {
        'Authorization': encryptedString
      }
    })
    
    obs.subscribe( 
      (response) => {
        let value = {
          username: form.username,
          auth: encryptedString
        }
        sessionStorage.setItem("user", JSON.stringify( value ) );
      },
      (error) => {
        console.log(error)
      }
    )

    return obs;
  }

  logout(){
    sessionStorage.removeItem("user");
    console.log( sessionStorage.getItem("user") )
  }

  isLogged(){
    return sessionStorage.getItem("user") != null;
  }

  getUserInfo(): null | UserInfo {
    if( !this.isLogged() )
      return null;

      return JSON.parse(sessionStorage.getItem("user"));   
  }
}
