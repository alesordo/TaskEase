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
  toDoTasksTitles : string[];
  board: Board;

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(){
    this.route.params.subscribe((
      (params: Params) => {
        console.log(params);
        this.taskService.getTasks(params['projectId']).subscribe((tasks: Task[]) => {
          this.tasks = tasks.sort((a, b) => a.statusIndex - b.statusIndex);
          this.toDoTasksTitles = this.tasks.filter(
              task => task.taskStatus == 0).map(task => task.title);
          // TODO: Add filtering for doing and done and pass to the board object
        });
      }
    ))
    this.taskService.getProjects().subscribe((projects: Project[]) => {
      this.projects = projects;
      console.log(projects);
    })
    this.board = new Board('Test Board', [
      [],
      ['Hello'],
      ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog']
    ])
  }



  drop(event: CdkDragDrop<string[]>) {
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
