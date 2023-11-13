import { Component } from '@angular/core';
import {TaskService} from "../../task.service";
import {Project} from "../../models/project.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent {
  constructor(private taskService: TaskService, private router: Router) { }

  createProject(title: string){
    this.taskService.createProject(title).subscribe((response: Project) => {
      console.log(response);
      // Navigating to /projects/response._id
      this.router.navigate(['/projects', response._id]).then(r => {});
    });
  }
}
