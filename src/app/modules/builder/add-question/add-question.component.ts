import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { QuestionType } from 'src/app/core/models/question.model';
import { QuestionService } from 'src/app/core/services/question.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  @Output() submitForm = new EventEmitter<FormGroup>();
  @Output() cancelForm = new EventEmitter<string>();
  questionForm: FormGroup;
  QuestionType = QuestionType;
  validationMsgs = {
    title: [{type: 'required', message: 'Title is Required'}],
    textOption: [{type: 'required', message: 'Value is Required'}],
  };
  isErrorForm = false;
  get optionsArray() {
    return this.questionForm.get('options') as FormArray
  }
  get validationMessage() {
    return this.validationMsgs as any;
  }

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.questionForm = this.fb.group({
      title: new FormControl('', Validators.required),
      questionType: new FormControl(QuestionType.Multiple),
      options: this.fb.array([
        new FormGroup({
          textOption: new FormControl('', Validators.required)
        })
      ]),
      allowOther: new FormControl(false),
      isRequired: new FormControl(false)
    });
  }

  addQuestion() {
    this.isErrorForm = this.questionForm.invalid;
    if(this.isErrorForm) {
      return
    };
    this.submitForm.emit(this.questionForm);
    this.initForm(); // remove this
  }

  addOption() {
    const option = new FormGroup({
      textOption: new FormControl('', Validators.required)
    })
    this.optionsArray.push(option);
  }

  removeOption(index: number) {
    if (this.optionsArray.length > 1) {
      this.optionsArray.removeAt(index)
    } else {
      this.optionsArray.reset()
    }
  }

  onChange(target: any) {
    const value = target.value;
    if(value === QuestionType.Paragraph) {
      this.questionForm.removeControl('options');
      this.questionForm.removeControl('allowOther');
    } else {
      this.questionForm.addControl(
        'options',
        this.fb.array([
          new FormGroup({
            textOption: new FormControl('', Validators.required)
          })
        ])
      );
      this.questionForm.addControl(
        'allowOther',
        new FormControl(false)
      );
    }
  }

  cancel() {
    this.cancelForm.emit('cancel');
  }
}
