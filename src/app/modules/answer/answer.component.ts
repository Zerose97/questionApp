import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionType } from 'src/app/core/models/question.model';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss']
})
export class AnswerComponent implements OnInit {
  listAnswer = [];
  QuestionType = QuestionType;
  constructor(
    private router: Router
  ) {}
  ngOnInit(): void {
    this.listAnswer = JSON.parse(localStorage.getItem('data') || '');
    console.log(this.listAnswer);
    
  }

  back() {
    this.router.navigate(['/form/builder'])
  }
}
