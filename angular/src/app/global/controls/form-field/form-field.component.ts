import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {

  constructor(

  ) {}

  @Input() label?: string
  @Input() messages?: string[]
  
}
