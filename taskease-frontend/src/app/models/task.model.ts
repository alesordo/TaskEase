export class Task{
  constructor(public _id: string,
              public title: string,
              public _projectId: string,
              public description: string,
              public dueDate: Date,
              public estimatedTime: number,
              public spentTime: number,
              public taskStatus: number,
              public statusIndex: number) {
  }
}
