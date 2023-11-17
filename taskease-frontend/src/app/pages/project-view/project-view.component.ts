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
import {ActivatedRoute, Params, Router} from "@angular/router";
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

  toDoTasks: Task[];

  doingTasks: Task[];

  doneTasks: Task[];

  selectedProjectId: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(){
    this.route.params.subscribe((
      (params: Params) => {
        console.log(params);
        this.taskService.getProjects().subscribe((projects: Project[]) => {
          this.projects = projects;
          console.log(projects);
        })
        if (params['projectId'] != null) {
          this.selectedProjectId = params['projectId'];
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
    let updatedTasks: Task[];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      // Getting all tasks from new container and saving them in updatedTasks
      for (let i = 0; i < event.container.data.length; i++) {
        event.container.data[i].statusIndex = (1024) * (i+1);
      }

      updatedTasks = event.container.data;
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      // Changing taskStatus of the moved task based on the destination container
      //event.container.data[event.currentIndex].taskStatus = Number(event.container.id.replace(/\D/g, ""));
      switch(event.container.id){
        case 'to-do-list': event.container.data[event.currentIndex].taskStatus = 0;
        break;
        case 'doing-list': event.container.data[event.currentIndex].taskStatus = 1;
        break;
        case 'done-list': event.container.data[event.currentIndex].taskStatus = 2;
        break;
      }

      // Getting all tasks from previous container and saving them in updatedTasks
      for (let i = 0; i < event.previousContainer.data.length; i++) {
        event.previousContainer.data[i].statusIndex = (1024) * (i+1);
      }
      updatedTasks = event.previousContainer.data;

      // Getting all tasks from new container and saving them in updatedTasks
      for (let i = 0; i < event.container.data.length; i++) {
        event.container.data[i].statusIndex = (1024) * (i+1);
      }
      updatedTasks = updatedTasks.concat(event.container.data);
    }

    // Sending the update to server
    this.taskService.updateTasksBin(updatedTasks);
  }

  onDeleteProjectClick() {
    this.taskService.deleteProject(this.selectedProjectId).subscribe((res: any) => {
      this.router.navigate(['/projects']);
      console.log(res);
    });
  }

  onDeleteTaskClick(id: string){
    this.taskService.deleteTask(this.selectedProjectId, id).subscribe((res: any) => {
      this.toDoTasks = this.toDoTasks.filter(val => val._id !== id);
      this.doingTasks = this.doingTasks.filter(val => val._id !== id);
      this.doneTasks = this.doneTasks.filter(val => val._id !== id);
    });
  }

}
