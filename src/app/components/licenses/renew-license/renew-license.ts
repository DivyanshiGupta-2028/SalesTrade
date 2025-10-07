import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, takeUntil } from 'rxjs';
import { License, RenewLicenseModal } from '../../Models/license.models';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-renew-license',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './renew-license.html',
  styleUrls: ['./renew-license.scss']
})
export class RenewLicense implements OnInit, OnChanges, OnDestroy {
  @Input() title = 'Renew License';
  @Input() licenseId!: number; 
  @Input() companyName!: string; 
  @Output() closed = new EventEmitter<void>();
  licenses$!: Observable<License[]>;

  
  renewForm!: FormGroup;
  private subscription: Subscription = new Subscription();

  constructor(private fb: FormBuilder,
              private exchangeService: LicenseService,
              private router: Router) {}

  ngOnInit() {
    this.renewForm = this.fb.group({
      licenseType: ['', Validators.required],
      licenseDuration: ['', Validators.required],
      startDate: [ '',Validators.required],
      endDate: ['', Validators.required],
      isActive: [true, Validators.required],
      companyName:['']
    });
        this.renewForm.get('licenseDuration')?.valueChanges
        //.pipe(takeUntil(this.destroy$))
        .subscribe(duration => {
          this.updateEndDateBasedOnDuration(duration);
        });

          this.renewForm.get('startDate')?.valueChanges
   // .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      const duration = this.renewForm.get('licenseDuration')?.value;
      if (duration) {
        this.updateEndDateBasedOnDuration(duration);
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['licenseId'] && changes['licenseId'].currentValue != null) {
      const id = changes['licenseId'].currentValue;
      console.log('LicenseId changed to:', id);
      this.subscription.unsubscribe();
      this.subscription = this.exchangeService.getLicenseDetail(id).subscribe({
        next: (data) => {
          console.log('Received license:', data);
          this.renewForm.patchValue({
            startDate: data.start || '',
            endDate: data.expiry || '',
            licenseType: data.licenseType || '',
            licenseDuration: data.licenseDuration || '',
            isActive: data.isActive || '',
            companyName:data.companyName || '',
          });
        },
        error: (error) => {
          console.error('Error fetching license details:', error);
        }
      });
    }
  }
  updateEndDateBasedOnDuration(duration: string | null): void {
  if (!duration) {
    return;
  }

  const startDateControl = this.renewForm.get('startDate');
  const endDateControl = this.renewForm.get('endDate');

  if (!startDateControl || !endDateControl) {
    return;
  }

  const startDateValue = startDateControl.value;
  if (!startDateValue) {
    return;
  }

  const startDate = new Date(startDateValue);
  let newEndDate: Date;

  switch (duration) {
    case 'trial':
      newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + 14);
      break;
    case 'monthly':
      newEndDate = new Date(startDate);
      newEndDate.setMonth(newEndDate.getMonth() + 1);
      break;
    case 'quaterly':
      newEndDate = new Date(startDate);
      newEndDate.setMonth(newEndDate.getMonth() + 3);
      break;
    case 'yealy':
      newEndDate = new Date(startDate);
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      break;
    case '2year':
      newEndDate = new Date(startDate);
      newEndDate.setFullYear(newEndDate.getFullYear() + 2);
      break;
    default:
      return;
  }

 
  const formattedEndDate = newEndDate.toISOString().substring(0, 10);
  endDateControl.setValue(formattedEndDate);
}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  close() {
    this.closed.emit();
  }


  upgradeLicense() {
  if (this.renewForm.invalid) {
    return;
  }
  const startDate = this.renewForm.get('startDate')?.value;
  const endDate = this.renewForm.get('endDate')?.value;
  const licenseType = this.renewForm.get('licenseType')?.value;
  const isActive = this.renewForm.get('isActive')?.value;
  const companyName = this.renewForm.get('companyName')?.value;
  const licenseDuration = this.renewForm.get('licenseDuration')?.value;
  const license: RenewLicenseModal = {
   
    licenseId: this.licenseId,
    licenseType: licenseType,
    startDate: startDate,
    endDate: endDate,
    isActive: isActive,   
    companyName: companyName ,
    licenseDuration: licenseDuration
  };

  this.exchangeService.updateRenewLicense(license).subscribe(
    (success) => {
      if(success) {
        alert(`Upgrade license for companyName: ${companyName} of ${licenseType} license  of period ${licenseDuration} from ${startDate} to ${endDate}.`);
        this.close();
      } else {
        alert('Failed to upgrade license.');
      }
    },
    (error) => {
      console.error('License upgrade error:', error);
      alert('Error during license upgrade.');
    }
  );
}
}
