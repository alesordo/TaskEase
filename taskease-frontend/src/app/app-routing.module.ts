import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectViewComponent} from "./pages/project-view/project-view.component";
import {NewProjectComponent} from "./pages/new-project/new-project.component";
import {NewTaskComponent} from "./pages/new-task/new-task.component";

const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full'},
  { path: 'new-project', component: NewProjectComponent},
  { path: 'new-task', component: NewTaskComponent},
  { path: 'projects', component: ProjectViewComponent},
  { path: 'projects/:projectId', component: ProjectViewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
