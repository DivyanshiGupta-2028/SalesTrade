import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InjectionToken, Provider } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { NgIf, NgComponentOutlet } from '@angular/common';


@Component({
  selector: 'app-dialog-content-component',
   standalone: true,
  imports: [MatDialogModule, BidiModule,  NgIf,
    NgComponentOutlet],
  templateUrl: './dialog-content-component.html',
  styleUrl: './dialog-content-component.scss'
})
export class DialogContentComponent {
 componentInjector: Injector;

    constructor(
    private dialog: MatDialog,
    private injector: Injector,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.extraData) {
      const providers: Provider[] = Object.entries(data.extraData).map(([key, value]) => ({
        provide: key,
        useValue: value
      }));
      this.componentInjector = Injector.create({
        providers,
        parent: this.injector
      });
    } else {
      this.componentInjector = this.injector;
    }
  }
}

