import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full" },
  {path:"home",component:HomeComponent,pathMatch:"full"},
  {path: 'pokemon/:id', component: InfoComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
