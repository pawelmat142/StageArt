import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { ControlComponent } from '../control/control.component';
import { BtnComponent } from '../../global/controls/btn/btn.component';
import { GroupComponent } from '../group/group.component';
import { ArrayComponent } from "../array/array.component";
import { pForm, pFormArray, pFormStep } from '../form-processor.service';
import { Store } from '@ngrx/store';
import { skip, Subscription, take, tap } from 'rxjs';
import { dataChange, FormType, openForm, selectFormId, startForm, storeForm } from '../form.state';
import { FormUtil } from '../../global/utils/form.util';
import { AppState } from '../../app.state';

@Component({
  selector: 'app-form-processor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ControlComponent,
    BtnComponent,
    GroupComponent,
    ArrayComponent
],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  templateUrl: './form-processor.component.html',
  styleUrl: './form-processor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FormProcessorComponent {

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<AppState>,
  ) {}

  @Input() form!: pForm
  formGroup = new FormGroup({})

  @Output() submit = new EventEmitter<any>()

  @Input() initialData?: any

  stepIndex = 0
  step?: pFormStep

  subscriptions: Subscription[] = []

  rebuildDetector = 0

  formData?: any

  ngOnInit(): void {
    
    this.subscriptions.push(this.store.select(dataChange).pipe(
      tap(formData => this.formData = formData),
      skip(1),
    ).subscribe(formData => {
      this.recreateArrayStepGroups()
      FormUtil.setFormValues(this.formGroup, this.formData)
      this.rebuildDetector++
    }))
    this.store.dispatch(openForm({ formType: FormType.BOOKING }))

    this.buildFormGroup()
    this.setStep()
  }

  ngOnChanges(changes: SimpleChanges): void  {
    if (changes['initialData']) {
      if (this.initialData) {
        Object.keys(this.initialData).forEach(key => {
          if (!this.formData?.[key]) {
            const data = this.initialData[key]
            if (this.formData) {
              this.formData[key] = data
            } else {
              this.formData = { [key]: data }
            }

            FormUtil.setFormValues(this.formGroup, this.formData)
          }
        })
      }
    }
  } 

  private recreated = false

  private recreateArrayStepGroups() {
    if (this.recreated) {
      return
    }
    this.recreated = true
    if (this.formData) {
      this.form.steps.forEach(step => {
        if (step.array) {
          const stepData = this.formData[FormUtil.toCamelCase(step.name)]
          if (Array.isArray(stepData)) {
            const stepGroups = stepData.map((data, i) => step.getGroup(i))
            step.groups = stepGroups
          }
        }
      })
    }
    this.buildFormGroup()
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  _next(keepIndex?: boolean) {
    const currentStepForm = this.currentStepForm
    if (currentStepForm) {
      if (currentStepForm?.valid) {
        this.startOrStoreFormAction()
        if (!keepIndex) {
          this.stepIndex++
          this.setStep()
        }
      } else {
        FormUtil.markForm(currentStepForm)
      }
    }
  }

  _submit() {
    this._next(true)
    this.submit.emit(this.formGroup.value)
  }

  _back() {
    const currentStepForm = this.currentStepForm
    if (currentStepForm) {
      if (currentStepForm?.valid) {
        this.startOrStoreFormAction()
      }
    }
    this.stepIndex--
    this.setStep()
  }

  _addToArray(stepName: string) {
    const step = this.form.steps.find(s => s.name === stepName)
    if (!step) {
      throw new Error(`not found step ${stepName}`)
    }
    
    if (!step?.array || !step.getGroup) {
      throw new Error(`step ${stepName} is not an array`)
    }

    const newName = Math.max(...step.groups.map(g => this.findNumberInArrayGroupName(g.name)))
    const newGroup = step.getGroup(newName)
    step.groups.push(newGroup)
    this.rebuildDetector++
    this.startOrStoreFormAction()
    
    this.buildFormGroup()
    FormUtil.setFormValues(this.formGroup, this.formData)
  }

  private findNumberInArrayGroupName(name: string) {
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0
  }


  _removeFromArray(stepName: string) {
    const step = this.form.steps.find(s => s.name === stepName)
    if (!step?.array) {
      throw new Error(`Step ${stepName} is not an array`)
    }
    step.groups.pop()
    this.rebuildDetector++
    this.buildFormGroup()
    FormUtil.setFormValues(this.formGroup, this.formData)
  }

  _removeActive = false
  private setStep() {
    this.step = this.form.steps[this.stepIndex]
    if (this.step.array) {
      this._removeActive = this.step.groups.length > 1
    }
  }


  private get currentStepForm(): FormGroup | FormArray | null {
    if (this.step) {
      const controlName = FormUtil.toCamelCase(this.step?.name)
      const stepForm = this.formGroup.get(controlName)
      if (stepForm instanceof FormGroup || stepForm instanceof FormArray) {
        return stepForm
      }
    }
    return null
  }


  private buildFormGroup() {
    const formGroup = new FormGroup({})

    this.form.steps.forEach(step => {

      if (step.array) {
        const arrayGroups = this.prepareStepFormArrayGroups(step)
        formGroup.addControl(FormUtil.toCamelCase(step.name), this.fb.array(arrayGroups))

      } else {

        const stepFormGroup = new FormGroup({})
        step.controls.forEach(control => {
          stepFormGroup.addControl(FormUtil.toCamelCase(control.name), FormUtil.prepareFormControl(control))
        })
        formGroup.addControl(FormUtil.toCamelCase(step.name), stepFormGroup)
      }

    })

    this.formGroup = formGroup
  }

  private prepareStepFormArrayGroups(step: pFormArray): FormGroup[] {
    const groups = step.groups.map((group, i) => {
      const formArrayGroup = new FormGroup({})
      group.controls.forEach(control => {
        formArrayGroup.addControl(FormUtil.toCamelCase(control.name), FormUtil.prepareFormControl(control))
      })
      return formArrayGroup
    })
    return groups
  }


  private startOrStoreFormAction() {
    const formdata = this.formGroup.value
    const formId = this.getFormId()
    if (formId) {
      this.store.dispatch(storeForm(formdata))
    } else {
      this.store.dispatch(startForm(formdata))
    }
  }

  private getFormId(): string {
    let id: string = ''
    this.store.select(selectFormId).pipe(take(1)).subscribe(_id => id = _id);
    return id;
  }
}