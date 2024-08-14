import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  @Output() submit = new EventEmitter<void>()
  
  @ViewChild('formButton') formButton!: ElementRef<HTMLInputElement>;
  @ViewChild('buttonControl') buttonControl!: ElementRef<HTMLInputElement>;

  @Input() label!: string
  
  @Input() active!: boolean

  @Input() type?: boolean
  @Input() color = 'light'

}
