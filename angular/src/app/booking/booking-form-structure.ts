import { Validators } from "@angular/forms"
import { pForm } from "../form-processor/form-processor.service"
import { FormType } from "../form-processor/form.state"
import { AppState } from "../app.state"
import { Store } from "@ngrx/store"
import { selectArtists } from "../artist/artists.state"
import { ArtistUtil } from "../artist/artist.util"
import { map, of } from "rxjs"
import { Country } from "../global/countries/country.model"

export class BookingFormStructure {

    constructor(
      private store: Store<AppState>,
      private countries: Country[]
    ) {}

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
                name: `Event country`,
                type: 'selector',
                validators: [Validators.required],
                selectorItems$: of(this.countries)
              }, {
                name: 'Venue Name',
              }, {
                name: 'Venue Address',
              }, {
                name: 'Nearest Airport',
                validators: [Validators.required]
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
            name: 'Promotor information',
            controls: [{
              name: 'Promotor Name',
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
              validators: [Validators.required]
            }, {
              name: 'Significant organized past events',
              type: 'textarea'
            }]
          }, {
            name: 'Artist information',
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
              name: 'Visa (if applicable)',
            }, {
              name: 'Details of media/recording requests'
            }]
          }, {
            name: 'Performance details',
            controls: [{
              name: 'Stage/room'
            }, {
              name: 'Proposed Set Time'
            }, {
              name: 'Running Order'
            }, {
              name: 'Doors'
            }, {
              name: 'Curfew'
            }, {
              name: 'Exclusivity / Radius issues'
            }, {
              name: 'Offer expiry date',
              type: 'date'
            }]
          }

        ]
      }
}
