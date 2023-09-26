import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnswerRoutingModule } from './answer-routing.module';
import { AnswerComponent } from './answer.component';


@NgModule({
  declarations: [
    AnswerComponent
  ],
  imports: [
    CommonModule,
    AnswerRoutingModule
  ]
})
export class AnswerModule { }
