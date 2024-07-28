import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  header: string
  content: string[]
  isError?: boolean
  error?: Error
}

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
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
