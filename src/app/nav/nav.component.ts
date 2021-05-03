import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private service : SessionService, private router:Router) { }

  ngOnInit(): void {
  }

  isLogged(){
    return this.service.isLogged();
  }

  logout(){
    this.service.logout();
    this.router.navigateByUrl("/accueil");
  }

}
