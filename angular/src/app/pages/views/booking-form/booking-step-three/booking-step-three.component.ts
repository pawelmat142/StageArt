import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../../../controls/input/input.component';

@Component({
  selector: 'app-booking-step-three',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent
  ],
  templateUrl: './booking-step-three.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BookingStepThreeComponent {

  @Input() form!: FormGroup

  ngOnInit(): void {
    console.log(this.form)
  }

}
