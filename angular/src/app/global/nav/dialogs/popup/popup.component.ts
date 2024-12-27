import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Chip } from '../../../../artist/model/artist-view.dto';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormUtil } from '../../../utils/form.util';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../controls/input/input.component';
import { ButtonModule } from 'primeng/button';
import { DialogBtn, DialogData } from '../../dialog.service';
import { DropdownComponent } from '../../../controls/dropdown/dropdown.component';
import { FormFieldComponent } from '../../../controls/form-field/form-field.component';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    ButtonModule,

    DropdownComponent,
    FormFieldComponent,
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig<DialogData>
  ) {}

  _defaultButton = true

  get data(): DialogData {
    return this.config.data as DialogData;
  }

  form?: FormGroup 

  private readonly closeButton: DialogBtn = { label: 'Close', severity: 'danger' }

  ngOnInit(): void {
    this.ref.onClose.subscribe(() => {
      if (this.data.error) {
        console.error(this.data.error)
      }
    })

    if (this.data.input || this.data.select) {
      const validators = this.data.inputValidators
      this.form = new FormGroup({
        control: new FormControl(this.data.inputValue || '', validators)
      })

      const submit: DialogBtn = {
        label: 'Submit',
        onclick: () => this._submit()
      } 
      
      if (this.data.buttons) {
        this.data.buttons.unshift(this.closeButton)
        this.data.buttons.push(submit)
      } else {
        this.data.buttons = [
          this.closeButton,
          submit
        ]
      }
    }

    this._defaultButton = !this.data.buttons?.length
  }

  _onChip(chip: Chip) {
    this.ref.close(chip.name)
  }

  _close(result?: any) {
    this.ref.close(result)
  }


  _onBtnClick(btn: DialogBtn) {
    this._close(btn.result)
    if (btn.onclick) {
      btn.onclick()
    }
  }

  _submit() {
    if (this.form?.invalid) {
      FormUtil.markForm(this.form)
      return
    }
    const value = this.form?.controls['control']?.value
    this.ref.close(value)
  }

}
