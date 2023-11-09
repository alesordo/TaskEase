import { Injectable } from '@angular/core';
import {WebRequestService} from "./web-request.service";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService : WebRequestService) { }

  createProject(title: string){
    // Sends a web request to create a project
    return this.webReqService.post('projects', { title });
  }

  getProjects() {
    return this.webReqService.get('projects');
  }
}
