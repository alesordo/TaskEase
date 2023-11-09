import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectViewComponent } from './pages/project-view/project-view.component';

import { DragDropModule } from "@angular/cdk/drag-drop";

import { HttpClientModule } from "@angular/common/http";
import { NewProjectComponent } from './pages/new-project/new-project.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectViewComponent,
    NewProjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
