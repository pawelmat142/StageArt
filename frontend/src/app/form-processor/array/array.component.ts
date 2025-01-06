import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, FormArray, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GroupComponent } from '../group/group.component';
import { ControlComponent } from '../control/control.component';
import { pFormArray } from '../form-processor.service';
import { FormUtil } from '../../global/utils/form.util';

@Component({
  selector: 'app-array',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    GroupComponent,
    ControlComponent,
  ],
  templateUrl: './array.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
})
export class ArrayComponent {

  constructor(
    private parentFormGroupDir: FormGroupDirective,
  ) {}


  @Input() step!: pFormArray

  @Input() rebuildDetector? = 0

  @Output() remove = new EventEmitter<void>()
  @Output() add = new EventEmitter<void>()


  _formArray?: FormArray
  _formArrayName?: string

  _formGroups?: FormGroup[]

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['step'] || changes['rebuildDetector']) {
      this.prepareFormGroup()
    }
  }

  private prepareFormGroup() {
    this._formArrayName = FormUtil.toCamelCase(this.step.name)
    const formArray = this.parentFormGroupDir.control.get(this._formArrayName)
    if (formArray instanceof FormArray) {
      this._formArray = formArray
      this._formGroups = this._formArray.controls as FormGroup[]
    }
  }

}
