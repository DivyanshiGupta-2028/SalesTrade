import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../../components/dialog-content-component/dialog-content-component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

 constructor(private dialog: MatDialog) {}



showPopup(title: string, contentComponent: any) {
  const dialogRef = this.dialog.open(DialogContentComponent, {
    minWidth: '300px',
    maxWidth: '1024px',
    data: {
      title: title,
      contentComponent: contentComponent
    }
  });

  return dialogRef.afterClosed();
}

showPopupWithData(title: string, contentComponent: any, data: any) {
  const dialogRef = this.dialog.open(DialogContentComponent, {
    minWidth: '400px',
    maxWidth: '90vw',
    data: {
      title,
      contentComponent,
      extraData: data
    }
  });

  return dialogRef.afterClosed();
}


}
