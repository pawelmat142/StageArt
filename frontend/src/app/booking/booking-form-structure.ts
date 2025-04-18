import { Validators } from "@angular/forms"
import { pForm } from "../form-processor/form-processor.service"
import { formData, FormType } from "../form-processor/form.state"
import { AppState } from "../app.state"
import { Store } from "@ngrx/store"
import { selectArtists } from "../artist/artists.state"
import { ArtistUtil } from "../artist/artist.util"
import { BehaviorSubject, map, Observable, of, switchMap } from "rxjs"
import { Country } from "../global/countries/country.model"
import { TimelineUtil } from "../global/utils/timeline.util"
import { ArtistTimelineService, TimelineItem } from "./services/artist-timeline.service"

export class BookingFormStructure {

    disabledDates$ = new BehaviorSubject<Date[]>([])

    constructor(
      private store: Store<AppState>,
      private countries$: Observable<Country[]>,
      private artistTimelineService?: ArtistTimelineService,
    ) {
      if (this.artistTimelineService) {
        this.store.select(formData).pipe(
          switchMap(formData => {
            const artist = formData?.artistInformation?.artist
            if (artist?.code) {
              return this.artistTimelineService!.artistTimeline$(artist.code)
            }
            return of([]) as Observable<TimelineItem[]>
          }),
          map(timeline => {
            const disabledDates = TimelineUtil.getDisabledDates(timeline)
            this.disabledDates$.next(disabledDates)
          }),
        ).subscribe()
      }
    }


    readonly tommorow = TimelineUtil.tommorow()

    form: pForm = {
        type: FormType.BOOKING,
        name: 'Booking form',
        steps: [
          {
            name: 'Event information',
            controls: [{
                name: 'Performance start date',
                type: 'date',
                date: {
                  min: this.tommorow,
                  disabledDays: this.disabledDates$.asObservable()
                },
                validators: [Validators.required]
              }, {
                name: 'Performance end date',
                date: {
                  min: this.tommorow,
                  disabledDays: this.disabledDates$.asObservable()
                },
                type: 'date',
              }, {
                name: 'Event name',
                type: 'text',
                validators: [Validators.required]
              }, {
                name: `Event country`,
                type: 'selector',
                validators: [Validators.required],
                selectorItems$: this.countries$
              }, {
                name: 'Venue Name',
              }, {
                name: 'Venue Address',
                validators: [Validators.required],
              }, {
                name: 'Nearest Airport',
                validators: [Validators.required]
              }, {
                name: 'Website',
                placeholder: 'www',
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
            name: 'Promoter information',
            controls: [{
              name: 'Promoter first name',
              validators: [Validators.required]
            }, {
              name: 'Promoter last name',
              validators: [Validators.required]
            }, {
              name: 'Company Name',
              validators: [Validators.required]
            }, {
              name: `Company country`,
              type: 'selector',
              selectorItems$: this.countries$
            }, {
              name: 'Company address',
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
              placeholder: 'www'
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
              name: 'Duration',
              validators: [Validators.required],
              placeholder: 'Minutes'
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
              type: 'date',
              date: {
                min: this.tommorow
              }
            }]
          }

        ]
      }
}
