import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuilderRoutingModule } from './builder-routing.module';
import { BuilderComponent } from './builder.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BuilderComponent,
    AddQuestionComponent
  ],
  imports: [
    CommonModule,
    BuilderRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class BuilderModule { }
