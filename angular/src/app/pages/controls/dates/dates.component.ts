import { Component, forwardRef, ViewEncapsulation } from '@angular/core';
import {CalendarModule} from 'primeng/calendar';
import { AbstractControlComponent } from '../abstract-control/abstract-control.component';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface DatePeriod {
  start?: Date
  end?: Date
}

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
      useExisting: forwardRef(() => DatesComponent),
      multi: true
    }
  ],
  templateUrl: './dates.component.html',
  styleUrl: './dates.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DatesComponent extends AbstractControlComponent<DatePeriod> {

  override get _EMPTY_VALUE(): DatePeriod { return { start: undefined, end: undefined } }

  _onClose(event: any) {
    this.onBlur()
  }

  _onOpen(event: any) {
    this.active = true
  }

  private lastSelectionStart = false

  override ngOnInit(): void  {

    super.ngOnInit()
    this.value = this._EMPTY_VALUE
  }

  _onInput(selection: Date) {
    this.select(selection)
  }

  private select(selection: Date) {
    if (!this.value) {
      this.value = this._EMPTY_VALUE
    }

    if (this.value.start?.getDate() === selection.getDate()) {
      this.value.end = undefined
      this.lastSelectionStart = true
    }

    if (!this.value.start) {
      this.value.start = selection
      this.lastSelectionStart = true
      return
    }
    
    if (!this.value.end) {
      this.value.end = selection
      this.lastSelectionStart = false
      return
    }

    if (this.lastSelectionStart) {
      this.value.end = selection
      this.lastSelectionStart = false
      return
    }

    this.value.start = selection
    this.lastSelectionStart = true
  }
}
