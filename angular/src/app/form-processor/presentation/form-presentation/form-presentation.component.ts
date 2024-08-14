import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { pForm, pFormStep } from '../../form-processor.service';
import { CommonModule } from '@angular/common';
import { FormUtil } from '../../../global/utils/form.util';
import { FormGroupPresentationComponent } from '../form-group-presentation/form-group-presentation.component';

@Component({
  selector: 'app-form-presentation',
  standalone: true,
  imports: [
    CommonModule,
    FormGroupPresentationComponent,
  ],
  templateUrl: './form-presentation.component.html',
  styleUrl: './form-presentation.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FormPresentationComponent {

  @Input() structure!: pForm

  @Input() data!: any

  _stepsWithData = new Map<pFormStep, any>()

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {

      this.structure.steps.forEach(step => {
        const data = this.data ? this.data[FormUtil.toCamelCase(step.name)] : null
        this._stepsWithData.set(step, data)
      })

    }
  }
  
  _iterable(value: any): any[] {
    return Array.isArray(value) ? value : [];
  }

}
