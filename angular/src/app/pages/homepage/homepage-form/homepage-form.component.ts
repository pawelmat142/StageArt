import { Component, OnInit } from '@angular/core';
import { InputComponent } from "../../form/input/input.component";
import { ButtonComponent } from '../../form/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../../services/http.service';

@Component({
  selector: 'app-homepage-form',
  standalone: true,
  imports: [InputComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './homepage-form.component.html',
  styleUrl: './homepage-form.component.scss'
})
export class HomepageFormComponent {

  constructor(
    private readonly http: HttpService
  ) {}

  form = new FormGroup({
    artist: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
  })


  get f() { return this.form.controls }

  submit() {
    console.log(this.form)
    this.http.test().subscribe(a => {
      console.log(a)
    })
  }

}
