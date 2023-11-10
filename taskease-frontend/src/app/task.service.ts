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

  getProjects() {
    // return this.webReqService.get('projects');
    return this.http.get<Project[]>(`${this.ROOT_URL}/projects`)
  }

  getTasks(projectId: string){
    // return this.webReqService.get(`projects/${projectId}/tasks`);
    return this.http.get<Task[]>(`${this.ROOT_URL}/projects/${projectId}/tasks`)
  }
}
