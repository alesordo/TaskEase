import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProjectViewComponent} from "./pages/project-view/project-view.component";
import {NewProjectComponent} from "./pages/new-project/new-project.component";
import {NewTaskComponent} from "./pages/new-task/new-task.component";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {SignupPageComponent} from "./pages/signup-page/signup-page.component";
import {EditProjectComponent} from "./pages/edit-project/edit-project.component";
import {EditTaskComponent} from "./pages/edit-task/edit-task.component";

const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full'},
  { path: 'new-project', component: NewProjectComponent},
  { path: 'edit-project/:projectId', component: EditProjectComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'signup', component: SignupPageComponent},
  { path: 'projects', component: ProjectViewComponent},
  { path: 'projects/:projectId', component: ProjectViewComponent},
  { path: 'projects/:projectId/new-task', component: NewTaskComponent},
  { path: 'projects/:projectId/edit-task/:taskId', component: EditTaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
