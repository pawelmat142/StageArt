import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { StepMode } from '../../../interface/checklist.interface';

@Component({
  selector: 'app-substep',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './substep.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SubstepComponent {

  constructor(

  ) {}

  @Input() mode: StepMode = 'blank'

  @Input() header?: string


  get _icon(): string {
    switch(this.mode) {
      case 'blank': return 'radio_button_unchecked'
      case 'available': return 'radio_button_checked'
      case 'ready': return 'check_circle'
      case 'error': return 'block'
      default: return 'block'
    }
  }


}

