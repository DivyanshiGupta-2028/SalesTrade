import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InjectionToken, Provider } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { NgIf, NgComponentOutlet } from '@angular/common';

export interface DialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}
@Component({
  selector: 'app-dialog-content-component',
   standalone: true,
  imports: [MatDialogModule, BidiModule,  NgIf,
    NgComponentOutlet],
  templateUrl: './dialog-content-component.html',
  styleUrl: './dialog-content-component.scss'
})
export class DialogContentComponent {
 constructor(
    public dialogRef: MatDialogRef<DialogData>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
