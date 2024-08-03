import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ArtistService } from '../../../services/artist/artist.service';
import { HeaderComponent } from '../../components/header/header.component';
import { BookingStepOneComponent } from './booking-step-one/booking-step-one.component';
import { BookingStepTwoComponent } from './booking-step-two/booking-step-two.component';
import { BookingStepFourComponent } from './booking-step-four/booking-step-four.component';
import { BookingStepThreeComponent } from './booking-step-three/booking-step-three.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BtnComponent } from '../../controls/btn/btn.component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BtnComponent,
    BookingStepOneComponent,
    BookingStepTwoComponent,
    BookingStepThreeComponent,
    BookingStepFourComponent,
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.scss'
})
export class BookingFormComponent {

  public static readonly path = `book-form`

  constructor(
  ) {}

  forms = new FormArray([
    new FormGroup({
      eventDate: new FormControl<Date | null>(null, Validators.required),
      eventName: new FormControl('', Validators.required),
      eventUrl: new FormControl(''),
      timetable: new FormControl(''),
    }),
    // TODO type
    new FormArray([], Validators.minLength(1)),
    new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      phoneNumber: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      telegram: new FormControl(''),
    }),
  ])

  _stepOne = this.forms.at(0) as FormGroup
  _stepTwo = this.forms.at(1) as unknown as FormArray
  _stepThree = this.forms.at(2) as FormGroup

  get _lastStep(): boolean {
    return this._stepIndex === this.forms.length
  }

  get _stepForm() {
    return this.forms.at(this._stepIndex-1)
  }


  _stepIndex = 1;
  _next() {
    if (this._lastStep) {
      return
    }
    if (this._stepForm.valid) {
      this._stepIndex ++
    } else {
      this.markStepFormAsDirty()
    }

  }

  _prev() {
    if (this._stepIndex > 1) {
      this._stepIndex--
    }
  }

  _submit() {
    console.log(this.forms)
    console.log('TODO: submit booking form')
  }

  private markStepFormAsDirty() {
    Object.values(this._stepForm.controls).forEach(control => {
      control.markAsDirty()
      control.markAsTouched()
    })
  }

  bookingProcess = {
    label: 'Booking form',
    stepIndex: 0,
    steps: [{
      label: 'Event details',
      controls: [{
        type: 'date',
        label: 'Event date',
        placeholder: 'Select event date/period...',
        required: true
      }, {
        type: 'text',
        label: 'Event name',
        placeholder: 'Provide event name...',
        required: true
      }, {
        type: 'text',
        label: 'Event URL',
        placeholder: 'Provide event url...',
      }, {
        type: 'textarea',
        label: 'Lineup / Timetable',
        placeholder: 'Provide lineup or timetable...',
      }]
    }, {
      label: 'Artist details',
      controls: [{
        // TODO temp
        type: 'text',
        label: 'Artist',
        placeholder: 'Select an artist',
        required: true,
      }, {
        type: 'text',
        label: 'Offer notes',
        placeholder: 'Notes if you have some...',
      }, {
        type: 'text',
        label: 'Stage time',
        placeholder: 'Info about stage time...',
        required: true
      }]
    }]
  }

}
