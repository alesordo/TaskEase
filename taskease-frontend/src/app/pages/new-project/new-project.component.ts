import { Component } from '@angular/core';
import {TaskService} from "../../task.service";

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent {
  constructor(private taskService: TaskService) { }

  createProject(title: string){
    this.taskService.createProject(title).subscribe((response: any) => {
      console.log(response);
      // Navigating to /lists/response._id
    });
  }
}
