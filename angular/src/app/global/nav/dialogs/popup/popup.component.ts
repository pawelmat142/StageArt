import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BtnComponent } from '../../../controls/btn/btn.component';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { InputComponent } from '../../../controls/input/input.component';
import { FormUtil } from '../../../utils/form.util';
import { SelectorItem, SelectorComponent } from '../../../controls/selector/selector.component';
import { Observable } from 'rxjs';
import { Chip } from '../../../../artist/model/artist-view.dto';

export interface DialogData {
  header: string
  content?: string[]
  isError?: boolean
  error?: Error
  buttons?: DialogBtn[]
  input?: string
  inputValidators?: ValidatorFn[]
  inputClass?: string
  inputValue?: string
  select?: string
  chips?: Chip[]
  items?: Observable<SelectorItem[]>
}

export interface DialogBtn {
  label: string
  class?: string
  type?: 'button' | 'submit'
  onclick?: () => any
}

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule,
    BtnComponent,
    ReactiveFormsModule,
    InputComponent,
    SelectorComponent
],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  _defaultButton = true

  form?: FormGroup 

  private readonly closeButton: DialogBtn = { label: 'Close', class: 'big' }

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(() => {
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
        class: 'grey big',
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
    this.dialogRef.close(chip.name)
  }

  _close() {
    this.dialogRef.close()
  }

  _onBtnClick(btn: DialogBtn) {
    this._close()
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
    this.dialogRef.close(value)
  }

}
