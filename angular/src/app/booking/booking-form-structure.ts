import { Validators } from "@angular/forms"
import { pForm, pFormGroup } from "../form-processor/form-processor.service"
import { FormType } from "../form-processor/form.state"
import { AppState } from "../app.state"
import { Store } from "@ngrx/store"
import { selectArtists } from "../artist/artists.state"
import { ArtistUtil } from "../artist/artist.util"
import { map } from "rxjs"

export class BookingFormStructure {

    constructor(private store: Store<AppState>) {}

    artistsStepGetter = (index: number): pFormGroup => {
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
