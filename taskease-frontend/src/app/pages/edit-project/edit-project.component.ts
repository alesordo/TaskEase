import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TaskService} from "../../task.service";

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit{

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router){}

  projectId: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.projectId = params['projectId'];
      }
    )
  }

  updateProject(title: string) {
    this.taskService.updateProject(this.projectId, title).subscribe(() => {
      this.router.navigate(['/projects', this.projectId]);
    })
  }
}
