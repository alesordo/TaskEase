import { Injectable } from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {HttpClient} from "@angular/common/http";
import {Task} from "./models/task.model";
import {Project} from "./models/project.model";

/* Changed original tutorial following this guide because of errors: https://stackoverflow.com/questions/58169051/angular-the-object-type-is-assignable-to-very-few-other-types
* Now web-request-service.ts is basically useless */

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  readonly ROOT_URL;

  constructor(private webReqService : WebRequestService, private http: HttpClient) {
    this.ROOT_URL = webReqService.ROOT_URL;
  }

  createProject(title: string){
    // Sends a web request to create a project
    // return this.webReqService.post('projects', { title });
    return this.http.post<Project>(`${this.ROOT_URL}/projects`, { title });
  }

  updateProject(id: string, title: string){
    // Sends a web request to edit a project
    // return this.webReqService.post('projects', { title });
    return this.http.patch(`${this.ROOT_URL}/projects/${id}`, { title });
  }

  getProjects() {
    // return this.webReqService.get('projects');
    return this.http.get<Project[]>(`${this.ROOT_URL}/projects`)
  }

  deleteProject(id: string) {
    return this.http.delete(`${this.ROOT_URL}/projects/${id}`);
  }

  getTasks(projectId: string){
    // return this.webReqService.get(`projects/${projectId}/tasks`);
    return this.http.get<Task[]>(`${this.ROOT_URL}/projects/${projectId}/tasks`)
  }

  createTask(title: string, projectId: string){
    // Default bucket, To do
    const taskStatus = 0;
    // Sends a web request to create a task
    return this.http.post<Task>(`${this.ROOT_URL}/projects/${projectId}/tasks`, {title, taskStatus});
  }

  updateTasksBin(tasks: Task[]){
    let status = {message: "Updated successfully"};

    tasks.map((task) => {
     this.http.patch(`${this.ROOT_URL}/projects/${task._projectId}/tasks/${task._id}`,
       {taskStatus: task.taskStatus, statusIndex: task.statusIndex
       }).subscribe((res: any) => {
         if(res !== status)
           status.message = "Errors while updating";
     });
    })

    return status;
  }
}
