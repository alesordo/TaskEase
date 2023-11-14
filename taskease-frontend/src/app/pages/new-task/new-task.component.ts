import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../task.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Task} from "../../models/task.model";
@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})

export class NewTaskComponent implements OnInit {
  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router){}

  projectId: string;

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.projectId = params['projectId'];
    })
  }

  createTask(title: string){
      this.taskService.createTask(title, this.projectId).subscribe((newTask: Task) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }
}
