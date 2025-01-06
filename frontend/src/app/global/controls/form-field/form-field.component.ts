import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
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
