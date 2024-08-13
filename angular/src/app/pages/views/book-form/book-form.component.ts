import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormProcessorComponent } from '../../../form-processor/form-processor/form-processor.component';
import { HeaderComponent } from '../../components/header/header.component';
import { pForm, pFormGroup } from '../../../form-processor/form-processor.service';
import { FormType, selectFormId, submittedForm } from '../../../form-processor/form.state';
import { AppState } from '../../../store/app.state';
import { Store } from '@ngrx/store';
import { initArtists, selectArtists } from '../../../store/artist/artists.state';
import { map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { ArtistUtil } from '../../../services/artist/artist.util';
import { loggedInChange } from '../../../auth/profile.state';
import { DialogService } from '../../../services/nav/dialogs/dialog.service';
import { BookingService } from '../../../services/booking/booking.service';
import { NavService } from '../../../services/nav/nav.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormProcessorComponent,
    HeaderComponent,
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BookFormComponent {

  public static readonly path = `book-form`

  constructor(
    private readonly store: Store<AppState>,
    private readonly dialog: DialogService,
    private readonly nav: NavService,
    private readonly bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(initArtists())
  }

  _submit(data: any) {
    this.store.select(loggedInChange).pipe(
      withLatestFrom(this.store.select(selectFormId)),
      switchMap(([loggedIn, formId]) => {
        if (!loggedIn) {
          this.dialog.loginPopup()
        } else if (!formId) {
          console.error('no form id')
        } else {
          return this.bookingService.submitForm$(formId)
        }
        return of()
      }),
      tap(console.log)
    ).subscribe({
      next: () => {
        this.store.dispatch(submittedForm())
        this.nav.home()
        // TODO
        this.dialog.simplePopup('Form submitted')
      },
      error: error => {
        console.error(error)
      }
    })
  }

  private artistsStepGetter = (index: number): pFormGroup => {
    return {
      name: `Artist #${index+1}`,
      controls: [{
          name: 'Artist',
          type: 'selector',
          validators: [Validators.required],
          selectorItems$: this.store.select(selectArtists).pipe(map(a => ArtistUtil.selectorItems(a)))
      }, {
        name: 'Offer',
      }, {
        name: 'Travel',
      }, {
        name: 'Accommodation',
      }, {
        name: 'Ground Transport',
      }, {
        name: 'Visa',
      }, {
        name: 'Details of media/recording requests',
        type: 'textarea',
      }]
    }
  }

  form: pForm = {
    type: FormType.BOOKING,
    name: 'Booking form',
    steps: [
      {
        name: 'Event information',
        controls: [{
            name: 'Performance start date',
            type: 'date',
            validators: [Validators.required]
          }, {
            name: 'Performance end date',
            type: 'date',
          }, {
            name: 'Event name',
            type: 'text',
            validators: [Validators.required]
          }, {
            name: 'Venue Name',
          }, {
            name: 'Venue Address',
          }, {
            name: 'Nearest Airport',
          }, {
            name: 'Website',
          }, {
            name: 'Venue Capacity',
          }, {
            name: 'Ticket Price',
          }, {
            name: 'Age Restriction',
          }, {
            name: 'Recent artists performed in venue',
          }, {
            name: 'Video link to recent show',
          }
        ]
      },
      {
        name: 'Artists',
        array: true,
        groups: [this.artistsStepGetter(0)],
        getGroup: this.artistsStepGetter
      },
      {
        name: 'Promoter information',
        controls: [{
          name: 'Promoter Name',
          validators: [Validators.required]
        }, {
          name: 'Company Name',
          validators: [Validators.required]
        }, {
          name: 'Company Address',
          validators: [Validators.required]
        }, {
          name: 'Company VAT Number',
          validators: [Validators.required]
        }, {
          name: 'Email',
          validators: [Validators.required, Validators.email]
        }, {
          name: 'Phone number',
          validators: [Validators.required]
        }, {
          name: 'Website',
        }, {
          name: 'Experience in organizing events (in years)',
        }, {
          name: 'Significant organized past events',
          type: 'textarea'
        }]
      },

    ]
  }

}
