import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-step-three',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './booking-step-three.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BookingStepThreeComponent {

  @Input() form!: FormGroup

}
