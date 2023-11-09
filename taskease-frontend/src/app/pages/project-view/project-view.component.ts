import { Component } from '@angular/core';
import {NgFor} from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import {Board} from "../../models/board.model";
import {TaskService} from "../../task.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent {

  projects: any;

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(){
    this.route.params.subscribe((
      (params: Params) => {
        console.log(params);
      }
    ))
    this.taskService.getProjects().subscribe((projects: Object) => {
      console.log(projects)
    })
  }

  board: Board = new Board('Test Board', [
    ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'],
    ['Hello'],
    ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog']
  ])

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
}
