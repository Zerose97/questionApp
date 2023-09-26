import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { QuestionType } from 'src/app/core/models/question.model';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {
  listQuestionForm: FormGroup;
  QuestionType = QuestionType;
  validationMsgs = {
    answer: [{type: 'required', message: 'The Answer is Required'}],
    otherContent: [{type: 'required', message: 'Content is Required'}],
  };
  openForm: boolean = false;
  indexQuest: any;
  get questionArray() {
    return this.listQuestionForm.get('questions') as FormArray
  }
  get validationMessage() {
    return this.validationMsgs as any;
  }
  isErrorForm = false;
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.listQuestionForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  onSubmit(event: FormGroup) {
    console.log('event', event); 
    const isParagraph = event.value.questionType === QuestionType.Paragraph;
    const isRequired = event.value.isRequired;
    const isAllowOther = event.value.allowOther;
    event.addControl(
      'answer',
      isParagraph ? new FormControl('', isRequired ? Validators.required : null) : new FormControl([], isRequired ? Validators.required : null)
    );
    if(isAllowOther) {
      event.addControl(
        'isSelectOther',
        new FormControl(false)
      );
      event.addControl(
        'otherContent',
        new FormControl('')
      )

      event.controls['otherContent'].valueChanges.pipe(
        debounceTime(2000),
      ).subscribe(value => {
        const isSelectOther = event.get('isSelectOther')?.value;
        let answerValue = event.get('answer')?.value;
        if(isSelectOther) {
          const lastItem = answerValue[answerValue.length - 1];
          if(lastItem) {
            const isOther = lastItem.startsWith("[O]");
            if(!isOther) {
              answerValue.push(`[O]${value}`);
              return;
            };
            answerValue = answerValue.filter((item: string) => item !== lastItem);
            answerValue.push(`[O]${value}`)
          } else {
            answerValue.push(`[O]${value}`)
          }
        }
        // if(!this.indexQuest === undefined) {
          (this.questionArray.at(this.indexQuest) as FormGroup).get('answer')?.setValue(answerValue); 
        // }
      });
    }
   
    this.questionArray.push(event);
    console.log(this.questionArray.value);
    
  }

  onCheck(target: any, indexQuest: number, value: string) {
    const checked = target.checked;
    // const controlQuest: FormGroup = this.questionArray.at(indexQuest) as FormGroup;
    // const frmArrOption: FormArray = controlQuest.get('options') as FormArray;
    // const controlOption: FormGroup = frmArrOption.at(indexOption) as FormGroup;
    // controlOption.get('isSelected')?.setValue(checked);
    const controlQuest: FormGroup = this.questionArray.at(indexQuest) as FormGroup;
    let answerValue = controlQuest.get('answer')?.value;
    if(checked) {
      answerValue.unshift(`[S]${value}`)
    } else {
      answerValue = answerValue.filter((item: string) => item !== `[S]${value}` );
    }
    controlQuest.get('answer')?.setValue(answerValue);
  }

  onCheckOther(target: any, indexQuest: number) {
    const checked = target.checked;
    const controlQuest: FormGroup = this.questionArray.at(indexQuest) as FormGroup;
    controlQuest.get('otherContent')?.setValue('');
    if(checked) {
      controlQuest.get('otherContent')?.setValidators(Validators.required);
      controlQuest.get('otherContent')?.updateValueAndValidity();
    } else {
      controlQuest.get('otherContent')?.clearValidators();
      controlQuest.get('otherContent')?.updateValueAndValidity();
      let answerValue = controlQuest.get('answer')?.value;
      const lastItem = answerValue[answerValue.length - 1];
      if(lastItem) {
        const isOther = lastItem.startsWith("[O]");
        if(!isOther) return;
        answerValue = answerValue.filter((item: string) => item !== lastItem);
        controlQuest.get('answer')?.setValue(answerValue);
      }
    }
  }

  reviewQuestion() {
    console.log(this.listQuestionForm.value);
    
    this.isErrorForm = this.listQuestionForm.invalid;
    if(this.isErrorForm) {
      return
    };
    const data = this.listQuestionForm.value;
    data.questions.map((d: any) => {
      if(d.questionType === QuestionType.Multiple) {
        d.answer = d.answer.map((a: string) => {
          const firstThreeLetters = a.substring(0, 3);
          a.substring(3);
          if(firstThreeLetters === "[O]") {
            return "Other-" + a.substring(3);
          }
          return a.substring(3);;
        });
      }
    });
    
    localStorage.setItem('data', JSON.stringify(data.questions));
    this.router.navigate(['form/answer']);
  }

  onCancel(e: any) {
    this.openForm = false;
  }

  onTyping(e: any, indexQuest: number) {
    console.log(indexQuest);
    
    this.indexQuest = indexQuest;
  }
}
