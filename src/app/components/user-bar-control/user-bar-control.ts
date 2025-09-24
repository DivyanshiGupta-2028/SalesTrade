import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-bar-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bar-control.html',
  styleUrl: './user-bar-control.scss'
})
export class UserBarControl {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() license: string = '';
  @Input() showBackButton: boolean = false;
  @Input() showSubtitle = false;
  @Input() showLicenseName = false;
  constructor(private router: Router, private location: Location, private cdr: ChangeDetectorRef) {}

  onBack() {
  this.location.back();
  setTimeout(() => {
    this.cdr.detectChanges();
  }, 0);
}

}

