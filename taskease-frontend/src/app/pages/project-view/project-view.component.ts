import {Component, OnInit} from '@angular/core';
import {NgFor} from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {Board} from "../../models/board.model";
import {Task} from "../../models/task.model";
import {TaskService} from "../../task.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Project} from "../../models/project.model";
import {NONE_TYPE} from "@angular/compiler";

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {

  projects: Project[];
  tasks: Task[];
  board: Board;

  toDoTasks: Task[];
  toDoTasksTitles : string[];

  doingTasks: Task[];
  doingTasksTitles: string[];

  doneTasks: Task[];
  doneTasksTitles: string[];

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(){
    this.route.params.subscribe((
      (params: Params) => {
        console.log(params);
        this.taskService.getProjects().subscribe((projects: Project[]) => {
          this.projects = projects;
          console.log(projects);
        })
        if (params['projectId'] != null) {
          this.taskService.getTasks(params['projectId']).subscribe((tasks: Task[]) => {
            // // Getting all tasks
            this.tasks = tasks;

            // Getting to do tasks
            this.toDoTasks = this.tasks.filter(task => task.taskStatus == 0);

            // Getting doing tasks
            this.doingTasks = this.tasks.filter(task => task.taskStatus == 1);

            // Getting done tasks
            this.doneTasks = this.tasks.filter(task => task.taskStatus == 2);
          });
        }
      }
    ))
  }



  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  protected readonly Task = Task;
}
