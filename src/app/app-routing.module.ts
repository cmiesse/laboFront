import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { CoursComponent } from './cours/cours.component';
import { EtudiantComponent } from './etudiant/etudiant.component';
import { LoggedGuard } from './guard/logged.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfesseurComponent } from './professeur/professeur.component';
import { SectionComponent } from './section/section.component';

const routes: Routes = [
  {path:'', redirectTo: 'accueil', pathMatch:'full'},
  { path:'accueil',component:AccueilComponent},
  {path:"professeur",component:ProfesseurComponent, canActivate:[LoggedGuard]},
  {path:"section",component:SectionComponent,canActivate:[LoggedGuard]},
  {path:"etudiant",component:EtudiantComponent,canActivate:[LoggedGuard]},
  {path:"cours",component:CoursComponent,canActivate:[LoggedGuard]},
  {path: '404', component:NotFoundComponent},
  {path:'**', redirectTo:'404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
