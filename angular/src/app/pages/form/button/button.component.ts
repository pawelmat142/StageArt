import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  @Input() label!: string
  
  @ViewChild('formButton') formButton!: ElementRef<HTMLInputElement>;
  @ViewChild('buttonControl') buttonControl!: ElementRef<HTMLInputElement>;
  
  @Input()
  active!: boolean


}
