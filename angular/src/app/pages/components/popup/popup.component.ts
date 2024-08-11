import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BtnComponent } from "../../controls/btn/btn.component";

export interface DialogData {
  header: string
  content?: string[]
  isError?: boolean
  error?: Error
}

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule,
    BtnComponent,
    BtnComponent,
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

  ngOnInit(): void {
    this.dialogRef.afterClosed().subscribe(() => {
      if (this.data.error) {
        console.error(this.data.error)
      }
    })
  }

  _defaultButton = true

  _close() {
    this.dialogRef.close()
  }

}
