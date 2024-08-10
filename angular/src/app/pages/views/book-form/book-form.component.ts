import { CommonModule } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FormProcessorComponent } from '../../../form-processor/form-processor/form-processor.component';
import { HeaderComponent } from '../../components/header/header.component';
import { pForm, pFormGroup, pFormControl, pControlType, pFormArray } from '../../../form-processor/form-processor.service';
import { FormType } from '../../../form-processor/form.state';
import { ArtistService } from '../../../services/artist/artist.service';

export class ArtistsSelectorControl implements pFormControl {

  constructor(private artistService: ArtistService) {}

  name = 'Artist'
  type = 'selector' as pControlType
  validators = [Validators.required]

  getSelectorItems = this.artistService.getArtistsSelectorItems
} 

export class ArtistsStep implements pFormArray {

  constructor(private artistService: ArtistService) {}

  array = true as true
  name = 'Artists'
  groups = [this.getFormGroup(0)]
  getGroup = this.getFormGroup

  private getFormGroup(index: number): pFormGroup {
    const artistControl = new ArtistsSelectorControl(this.artistService)
    return {
      name: index.toString(),
      controls: [
        artistControl,
      {
        name: 'Offer',
        type: 'text',
      }, {
        name: 'Travel',
        type: 'text',
      }, {
        name: 'Accommodation',
        type: 'text',
      }, {
        name: 'Ground Transport',
        type: 'text',
      }, {
        name: 'Visa',
        type: 'text',
      }, {
        name: 'Details of media/recording requests',
        type: 'textarea',
      }]
    }
  }
}

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
    private readonly artistService: ArtistService,
  ) {}

  form: pForm = {
    type: FormType.BOOKING,
    name: 'Booking form',
    steps: [
      {
        name: 'Event information',
        controls: [{
            name: 'Performance date',
            type: 'period',
            validators: [Validators.required]
          }, {
            name: 'Event name',
            type: 'text',
            validators: [Validators.required]
          }, {
            name: 'Venue Name',
            type: 'text',
          }, {
            name: 'Venue Address',
            type: 'text',
          }, {
            name: 'Nearest Airport',
            type: 'text',
          }, {
            name: 'Website',
            type: 'text',
          }, {
            name: 'Venue Capacity',
            type: 'text',
          }, {
            name: 'Ticket Price',
            type: 'text',
          }, {
            name: 'Age Restriction',
            type: 'text',
          }, {
            name: 'Recent artists performed in venue',
            type: 'text',
          }, {
            name: 'Video link to recent show',
            type: 'text',
          }
          
        ]
      },
      new ArtistsStep(this.artistService),
      {
        name: 'Promoter information',
        controls: [{
          name: 'Promoter Name',
          type: 'text',
          validators: [Validators.required]
        }, {
          name: 'Company Name',
          type: 'text',
          validators: [Validators.required]
        }, {
          name: 'Company Address',
          type: 'text',
          validators: [Validators.required]
        }, {
          name: 'Company VAT Number',
          type: 'text',
          validators: [Validators.required]
        }, {
          name: 'Email',
          type: 'text',
          validators: [Validators.required, Validators.email]
        }, {
          name: 'Phone number',
          type: 'text',
          validators: [Validators.required]
        }, {
          name: 'Website',
          type: 'text',
        }, {
          name: 'Experience in organizing events (in years)',
          type: 'text',
        }, {
          name: 'Significant organized past events',
          type: 'text',
        }]
      },

    ]
  }

}
