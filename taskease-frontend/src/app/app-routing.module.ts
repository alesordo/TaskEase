import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectViewComponent} from "./pages/project-view/project-view.component";

const routes: Routes = [
  { path: '', component: ProjectViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
