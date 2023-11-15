import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectViewComponent } from './pages/project-view/project-view.component';

import { DragDropModule } from "@angular/cdk/drag-drop";

import { HttpClientModule } from "@angular/common/http";
import { NewProjectComponent } from './pages/new-project/new-project.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgOptimizedImage} from "@angular/common";
import { LoginPageComponent } from './pages/login-page/login-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectViewComponent,
    NewProjectComponent,
    NewTaskComponent,
    LoginPageComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        DragDropModule,
        HttpClientModule,
        MatFormFieldModule,
        MatDatepickerModule,
        NgOptimizedImage
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
