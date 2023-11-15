import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectViewComponent} from "./pages/project-view/project-view.component";
import {NewProjectComponent} from "./pages/new-project/new-project.component";
import {NewTaskComponent} from "./pages/new-task/new-task.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";

const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full'},
  { path: 'new-project', component: NewProjectComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'projects', component: ProjectViewComponent},
  { path: 'projects/:projectId', component: ProjectViewComponent},
  { path: 'projects/:projectId/new-task', component: NewTaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
