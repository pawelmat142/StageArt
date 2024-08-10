import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { Util } from '../../utils/util';
import { ControlComponent } from '../control/control.component';
import { pFormGroup } from '../form-processor.service';
import { FormUtil } from '../../utils/form.util';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ControlComponent,
  ],
  templateUrl: './group.component.html',
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
})
export class GroupComponent {

  constructor(
    private parentFormGroupDir: FormGroupDirective,
  ) {}

  @Input() step!: pFormGroup

  @Input() rebuildDetector? = 0


  _formGroup?: FormGroup

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['step'] || changes['rebuildDetector']) {
      this.prepareFormGroup()
    }
  }

  private prepareFormGroup() {
    const formGroupName = FormUtil.toCamelCase(this.step.name)
    const formGroup = this.parentFormGroupDir.control.get(formGroupName)

    if (formGroup instanceof FormGroup) {
      this._formGroup = formGroup
    } 

    else {
      console.error(`not found form group for step: ${this.step.name}`)
    }
  }

}
