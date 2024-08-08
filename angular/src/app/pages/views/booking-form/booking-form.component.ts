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
import { DatePeriod } from '../../controls/dates/dates.component';
import { Country } from '../../../services/countries/country.model';
import { BookingFormService } from '../../../store/booking-form/booking-form.service';
import { Subscription, tap } from 'rxjs';
import { BookingFormState, openForm, startForm, storeForm } from '../../../store/booking-form/booking-form.state';
import { BookingForm } from '../../../store/booking-form/booking-form.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';

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
    private readonly bookingFormService: BookingFormService,
    private readonly store: Store<AppState>,
  ) {}

  newArtistGroup = () => this.fb.group({
    artist: new FormControl<ArtistViewDto | undefined>(undefined, Validators.required),
    offerNotes: new FormControl(''),
    stageTime: new FormControl('', Validators.required),
  })

  forms = new FormGroup({
    eventDetails: new FormGroup({
      datePeriod: new FormControl<DatePeriod | null>(null, Validators.required),
      name: new FormControl('', Validators.required),
      country: new FormControl<Country | null>(null, Validators.required),
      locationInfo: new FormControl(''),
      eventUrl: new FormControl(''),
      timetable: new FormControl(''),
    }),

    artistsDetails: new FormArray([this.newArtistGroup()], Validators.minLength(1)),
  
    contactDetails: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl(''),
      phoneNumber: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      telegram: new FormControl(''),
    })
  })

  bookingFormSubscription?: Subscription

  bookingForm?: BookingFormState


  onBookingForm(bookingForm: BookingFormState) {
    this.bookingForm = bookingForm
    if (!bookingForm.form.id) {
      return
    }
    console.log('onBookingForm')
    this.setFormValues(this.forms, bookingForm.form)
  }

  ngOnInit(): void {
    this.bookingFormSubscription = this.store.select('bookingForm').subscribe(bookingForm => {
      console.log(bookingForm)
    })
    this.store.dispatch(openForm())

  }


  setFormValues(formGroup: FormGroup, object: any) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key)
      const value = object[key]

      if (control && value) {
        if (control instanceof FormGroup) {
          this.setFormValues(control, value)
        }
        else 
        if (control instanceof FormArray) {
          this.setFormArray(control, value)
        }
        else 
        if (control instanceof FormControl) {
          control.setValue(value)
        }
      }
    })
  }

  setFormArray(formArray: FormArray, array: any) {
    formArray.controls.forEach((control, index) => {
      const value = array[index]
      if (control instanceof FormGroup) {
        this.setFormValues(control, value)
      } 
      else 
      if (control instanceof FormArray) {
        this.setFormArray(control, value)
      }
      else 
      if (control instanceof FormControl) {
        control.setValue(value)
      }
    })

  }


  ngOnDestroy() {
    this.bookingFormSubscription?.unsubscribe()
  }


  _stepOne = this.forms.controls.eventDetails
  _stepTwo = this.forms.controls.artistsDetails
  _stepThree = this.forms.controls.contactDetails

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

      const bookingForm = this.forms.value as BookingForm

      this.bookingFormService.getId$().pipe(tap(id => {
        if (id) {
          bookingForm.id = id
          this.store.dispatch(storeForm(bookingForm))
        } else {
          this.store.dispatch(startForm(bookingForm))
        }
      })).subscribe()
      
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
    console.log('TODO: submit booking form')
  }

  _addArtist() {
    const artistsFormArr = this.forms.controls.artistsDetails
    artistsFormArr.push(this.newArtistGroup())
  }

  _removeArtist() {
    const controls = this._stepTwo.controls
    controls.length = controls.length-1
    this._stepTwo.controls = controls
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
