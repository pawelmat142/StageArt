import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { StepMode } from '../../../interface/checklist.interface';
import { IconComponent } from '../../../../global/components/icon/icon.component';

@Component({
  selector: 'app-substep',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
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
      case 'blank': return 'pi-circle'
      case 'available': return 'pi-circle-on'
      // case 'available': return 'pending_outlined'
      case 'ready': return 'pi-check-circle'
      case 'error': return 'pi-exclamation-circle'
      default: return 'block'
    }
  }

}

