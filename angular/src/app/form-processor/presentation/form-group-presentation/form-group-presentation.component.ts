import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { pFormControl, pFormGroup } from '../../form-processor.service';
import { FormUtil } from '../../../global/utils/form.util';
import { TextareaElementComponent } from '../../../global/controls/textarea-element/textarea-element.component';

@Component({
  selector: 'app-form-group-presentation',
  standalone: true,
  imports: [
    CommonModule,
    TextareaElementComponent
  ],
  templateUrl: './form-group-presentation.component.html',
  styleUrl: './form-group-presentation.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FormGroupPresentationComponent {

  @Input() structure!: pFormGroup
  @Input() data?: any


  _controlsWithData = new Map<pFormControl, any>()


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {

      this.structure.controls.forEach(control => {
        const data = this.data ? this.data[FormUtil.toCamelCase(control.name)] : null
        this._controlsWithData.set(control, data)
      })

    }
  }

}
