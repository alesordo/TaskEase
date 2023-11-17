import { Component } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TaskService} from "../../task.service";

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent {
  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router){}

  taskId: string;
  projectId: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.taskId = params['taskId'];
        this.projectId = params['projectId'];
      }
    )
  }

  updateTask(title: string) {
    this.taskService.updateTask(this.taskId, this.projectId, title).subscribe(() => {
      this.router.navigate(['/projects', this.projectId]);
    })
  }
}
