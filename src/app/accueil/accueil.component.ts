import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    builder: FormBuilder, 
    private service: SessionService/*, 
    private router: Router*/
  ) {
    this.loginForm = builder.group({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    })
   }

  ngOnInit(): void {
  }

  onLogin() {
    if( this.loginForm.valid )
      this.service.login( this.loginForm.value ).subscribe( () => {this.loginForm.reset(),console.log("Connecté")} )
      //this.router.navigateByUrl("/accueil")
  }
  
  isLogged(){
    return this.service.isLogged();
  }

  
}
