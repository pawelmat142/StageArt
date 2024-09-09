import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { BookingDto } from '../../../services/booking.service';
import { SubstepComponent } from '../substep/substep.component';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-contract-substep',
  standalone: true,
  imports: [   
    CommonModule,
    StepperModule,
    SubstepComponent,
    ButtonModule,
    StepsModule
  ],
  templateUrl: './contract-substep.component.html',
  styleUrl: './contract-substep.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ContractSubstepComponent {

  @Input() booking!: BookingDto

  activeStep = 0

  items: MenuItem[] | undefined;

  ngOnInit() {
      this.items = [
          {
              label: 'Personal Info'
          },
          {
              label: 'Reservation'
          },
          {
              label: 'Review'
          }
      ];
  }
}
