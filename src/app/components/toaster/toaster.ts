import { Component } from '@angular/core';

@Component({
  selector: 'app-toaster',
  imports: [],
  templateUrl: './toaster.html',
  styleUrl: './toaster.scss'
})
export class Toaster {
toastrOptions = {
  positionClass: 'toast-center-center', 
  timeOut: 3000, 
  extendedTimeOut: 1000,
  tapToDismiss: true,
  closeButton: true,
  progressBar: true,

};
}
