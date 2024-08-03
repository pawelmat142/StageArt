import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-step-two',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './booking-step-two.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BookingStepTwoComponent {

  @Input() formArr!: FormArray

}
