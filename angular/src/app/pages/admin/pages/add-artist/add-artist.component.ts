import { Component } from '@angular/core';
import { InputComponent } from '../../../form/input/input.component';
import { ButtonComponent } from '../../../form/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-add-artist',
  standalone: true,
  imports: [
    InputComponent, 
    ButtonComponent, 
    ReactiveFormsModule,
    HeaderComponent,
  ],
  templateUrl: './add-artist.component.html',
  styleUrl: './add-artist.component.scss'
})
export class AddArtistComponent {

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  })

  get f() { return this.form.controls }

  ngOnInit() {
    console.log(this.form)
  }


  submit() {
    console.log(this.form)
  }

}
