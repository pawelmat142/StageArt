import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormUtil } from '../../../../global/utils/form.util';
import { InputComponent } from '../../../../global/controls/input/input.component';
import { BtnComponent } from '../../../../global/controls/btn/btn.component';

@Component({
  selector: 'app-pin-view',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    BtnComponent,
  ],
  templateUrl: './pin-view.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class PinViewComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<PinViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { token: string },
  ) {}

  form = new FormGroup({
    pin: new FormControl('', [Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])
  })
  
  _submit() {
    if (this.form.invalid) {
      FormUtil.markForm(this.form)
      return
    }
    this.dialogRef.close(this.form.controls.pin.value)
  }

}
