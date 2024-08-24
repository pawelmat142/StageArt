import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import {CalendarModule} from 'primeng/calendar';
import { AbstractControlComponent } from '../../../global/controls/abstract-control/abstract-control.component';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Util } from '../../../global/utils/util';

@Component({
  selector: 'app-dates',
  standalone: true,
  imports: [
    CalendarModule,
    CommonModule, ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true
    }
  ],
  templateUrl: './date.component.html',
  styleUrl: './date.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DateComponent extends AbstractControlComponent<Date | null> {

  override get _EMPTY_VALUE(): Date | null { return null }

  _onClose(event: any) {
    this.onBlur()
  }

  _onOpen(event: any) {
    this.active = true
  }

  _onInput(selection: Date) {
    this.updateValue(selection)
  }

  override writeValue(value: Date | null): void {
    this.value = value ? new Date(value) : null

    setTimeout(() => {
      if (!this.input) {
        console.warn("no input ref when write value")
      }
      if (this.value && this.input) {
        this.input.value = Util.formatDate(this.value)
      }
    })
  }

}
