import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { BookingStepOneComponent } from './booking-step-one/booking-step-one.component';
import { BookingStepTwoComponent } from './booking-step-two/booking-step-two.component';
import { BookingStepFourComponent } from './booking-step-four/booking-step-four.component';
import { BookingStepThreeComponent } from './booking-step-three/booking-step-three.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BtnComponent } from '../../controls/btn/btn.component';
import { ArtistViewDto } from '../../../services/artist/model/artist-view.dto';
import { Util } from '../../../utils/util';

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
    private readonly fb: FormBuilder,
  ) {}

  forms = new FormGroup({
    one: new FormGroup({
      eventDate: new FormControl<Date | null>(null, Validators.required),
      eventName: new FormControl('', Validators.required),
      eventCountry: new FormControl('', Validators.required),
      locationInfo: new FormControl(''),
      eventUrl: new FormControl(''),
      timetable: new FormControl(''),
    }),

    two: new FormArray([this.newArtistGroup()], Validators.minLength(1)),
  
    three: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      phoneNumber: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telegram: new FormControl(''),
    })
  })


  _stepOne = this.forms.controls.one
  _stepTwo = this.forms.controls.two
  _stepThree = this.forms.controls.three

  get _lastStep(): boolean {
    return this._stepIndex === 3
  }

  get _stepForm() {
    if (this._stepIndex === 1) {
      return this._stepOne
    }
    if (this._stepIndex === 2) {
      return this._stepTwo
    }
    if (this._stepIndex === 3) {
      return this._stepThree
    }
    throw new Error("Step error")
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

  _addArtist() {
    const artistsFormArr = this.forms.controls.two
    artistsFormArr.push(this.newArtistGroup())
  }

  _removeArtist() {
    const controls = this._stepTwo.controls
    controls.length = controls.length-1
    this._stepTwo.controls = controls
  }

  private newArtistGroup() {
    return this.fb.group({
      artist: new FormControl<ArtistViewDto | undefined>(undefined, Validators.required),
      offerNotes: new FormControl(''),
      stageTime: new FormControl('', Validators.required),
    })
  }

  private markStepFormAsDirty() {
    const controls = this._stepForm.controls
    if (Array.isArray(controls)) {
      controls.forEach(control => {
        Util.markForm(control)
      })
    } else {
      Util.markForm(this._stepForm)
    }
  }

}
