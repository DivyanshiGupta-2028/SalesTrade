import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { Langauges } from '../../Models/langauges.models';
import { Currencies } from '../../Models/currencies.models';
import { Country } from '../../Models/country.models';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { MasterService } from '../../../services/master/master.service';
import { ClientAddress } from '../../Models/Client.model';
import { ClientService } from '../../../services/Client/client-service';
import { License } from '../../Models/license.models';
import { UserBarControl } from '../../user-bar-control/user-bar-control';

@Component({
  selector: 'app-add-license',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserBarControl],
  templateUrl: './add-license.html',
  styleUrls: ['./add-license.scss']
})
export class AddLicense implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  licenseForm!: FormGroup;
  currentStep = 1;
  userId: string = '';
  licenseId?: number = 0;
  currencies$!: Observable<Currencies[]>;
  languages$!: Observable<Langauges[]>;
  countries$!: Observable<Country[]>;
  licenses$!: Observable<License[]>;
    parentLicenses$!: Observable<License[]>;
  parentLicenseName$!: Observable<string | undefined>;
  errorMessage: string = '';

  
  isLoading = false;
  isCountriesLoading = true;
  isStatesLoading = true;
  
  countryOptions: { value: number, label: string }[] = [];
  stateOptions: { value: string, label: string }[] = [];
  selectedCountries = 0;

  pageTitle = 'License Company';
  pageSubtitle = '';
  showBackFlag = true;
  showSubtitle = true;
  showLicenseName = false;

  fieldDisplayNames: { [key: string]: string } = {
    addressLine1: 'Address Line 1',
    addressLine2: 'Address Line 2',
    addressLine3: 'Address Line 3',
    country: 'Country',
    state:'State',
    pincode: 'PinCode',
    latitude: 'Latitude',
    longitude: 'Longitude',
  };

  constructor(
    private fb: FormBuilder,
    private licenseService: LicenseService,
    private masterService: MasterService,
    public clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.userId = params['userId'] || '';
      if (this.userId) {
        this.licenseService.getUserDetail(this.userId).subscribe(userProfile => {
  this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
});
}
    });

    this.licenses$ = this.licenseService.getParentLicenses();
    this.countries$ = this.licenseService.getCountrySelectedItems();
    this.languages$ = this.licenseService.getLangaugeSelectedItems();
    this.currencies$ = this.licenseService.getCurrencySelectedItems();
    this.parentLicenses$ = this.licenseService.getParentLicenses();

    this.initializeForm();
    this.loadCountries();

     this.route.queryParamMap.subscribe(params => {
      this.licenseId = +params.get('licenseId')!;
      if (this.licenseId) {
        this.loadLicenseDetails(this.licenseId);
      }
    });
    this.licenses$.pipe(takeUntil(this.destroy$)).subscribe(licenses => {
    if (licenses && licenses.length > 0) {
      this.licenseForm.get('step1.licenseParentId')?.setValue(licenses[0].licenseId);
    }
  });

    this.licenseForm.get('step2.licenseDuration')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(duration => {
        this.updateEndDateBasedOnDuration(duration);
      });


    this.licenseForm.get('step4.country')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(countryId => {
        if (countryId) {
          this.selectedCountries = countryId;
          this.loadStatesByCountry(countryId);
        } else {
          this.stateOptions = [];
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    
    const LATITUDE_PATTERN = /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})?$/;
    const LONGITUDE_PATTERN = /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,10})?$/;

    this.licenseForm = this.fb.group({
      step1: this.fb.group({
        licenseParentId: ['', Validators.required],
        companyName: ['', Validators.required]
      }),
      step2: this.fb.group({
        licenseType: ['standard', Validators.required],
        licenseDuration: ['', Validators.required],
        startDate: [formatDate(today, 'yyyy-MM-dd', 'en'), Validators.required],
        endDate: [formatDate(nextYear, 'yyyy-MM-dd', 'en'), Validators.required],
        renewal: ['yes']
      }),
      step3: this.fb.group({
        currency: ['USD', Validators.required],
        language: ['English', Validators.required],
        localization: ['en-US', Validators.required],
        referencePrefix: ['', Validators.required],
        isActive: [true]
      }),
      step4: this.fb.group({
        addressLine1: ['', [Validators.required, Validators.maxLength(100)]],
        addressLine2: ['', [Validators.required, Validators.maxLength(100)]],
        addressLine3: ['', [Validators.required, Validators.maxLength(100)]],
        addressLine4: ['', Validators.maxLength(100)],
        country: ['', Validators.required],
        state: ['', Validators.maxLength(100)],
        otherState: [''],
        pincode: ['', [Validators.required, Validators.maxLength(10)]],
        latitude: ['', [Validators.required, Validators.pattern(LATITUDE_PATTERN)]],
        longitude: ['', [Validators.required, Validators.pattern(LONGITUDE_PATTERN)]]
      })
    });
  }




 loadLicenseDetails(id: number): void {
  this.licenseService.getLicenseDetail(id).subscribe(data => {
    if (data) {
      // Step 1
      this.licenseForm.get('step1')?.patchValue({
        companyName: data.companyName || '',
        licenseParentId: data.licenseParentId || null
      });

      // Step 2
      this.licenseForm.get('step2')?.patchValue({
        licenseType: data.licenseType || '',
        licenseDuration: data.licenseDuration || '',
        startDate: data.start || '',
        endDate: data.expiry || '',
        renewal: data.renewal || ''
      });

      // Step 3
      this.licenseForm.get('step3')?.patchValue({
        currency: data.currency || '',
        language: data.language || '',
        localization: data.localization || '',
        referencePrefix: data.referencePrefix || '',
        isActive: data.isActive ?? false
      });

      // Step 4
      this.licenseForm.get('step4')?.patchValue({
        addressLine1: data.addressLine1 || '',
        addressLine2: data.addressLine2 || '',
        addressLine3: data.addressLine3 || '',
        addressLine4: data.addressLine4 || '',
        country: data.country || '',
        state: data.state || '',
        pincode: data.pincode || '',
        latitude: data.latitude || '',
        longitude: data.longitude || ''
      });


      if (data.licenseParentId) {
        this.parentLicenseName$ = this.licenseService.getLicenseDetail(data.licenseParentId).pipe(
          map(parentData => parentData?.companyName || 'Unknown')
        );
      } else {
        this.parentLicenseName$ = new Observable(observer => {
          observer.next('No Parent License');
          observer.complete();
        });
      }
    }
  }, error => {
    this.errorMessage = 'Error fetching License details.';
  });
}


  nextStep(): void {

  const stepGroup = this.licenseForm.get(`step${this.currentStep}`);
  if (stepGroup) {
    stepGroup.markAllAsTouched();
  }

  // Only move to next step if current step is valid
  if (stepGroup?.valid) {
    this.currentStep++;
  }
}


  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

     updateEndDateBasedOnDuration(duration: string | null): void {
  if (!duration) {
    return;
  }

  const startDateControl = this.licenseForm.get('step2.startDate');
  const endDateControl = this.licenseForm.get('step2.endDate');

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
    case 'yearly':
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


  private loadCountries(): void {
    this.isCountriesLoading = true;
    this.clientService.getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries: any[]) => {
          this.countryOptions = countries.map(c => ({ value: c.id, label: c.name }));
          this.isCountriesLoading = false;
        },
        error: () => { this.countryOptions = []; this.isCountriesLoading = false; }
      });
  }

 private loadStatesByCountry(countryId: number): void {
  if (!countryId) {
    this.stateOptions = [];
    return;
  }

  this.isStatesLoading = true;

  this.clientService.getStatesByCountry(countryId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (states: any[]) => {
        this.stateOptions = states.map(state => ({
          value: state.id,
          label: state.name
        }));
        this.isStatesLoading = false;
      },
      error: (error) => {
        console.error('Error loading states:', error);
        this.stateOptions = [];
        this.isStatesLoading = false;
      }
    });
}

private formatDateOnly(date: any): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null; 
  return d.toISOString().split('T')[0]; 
}

saveLicense(): void {
  if (this.licenseForm.invalid) {
    this.licenseForm.markAllAsTouched();
    return;
  }

  const step2 = this.licenseForm.value.step2;

  const licensePayload  = {
    ...this.licenseForm.value.step1,
    ...step2,
    ...this.licenseForm.value.step3,
    ...this.licenseForm.value.step4,
    userId: this.userId,
    startDate: this.formatDateOnly(step2.startDate), 
    endDate: this.formatDateOnly(step2.endDate),
    dateCreated: this.licenseId ? undefined : new Date()
  };

  if (this.licenseId) {
    licensePayload['licenseId'] = this.licenseId;
    this.licenseService.updateLicense(licensePayload).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.router.navigate(['/license-client-flow'], {
            queryParams: { licenseId: this.licenseId, userId: this.userId }
          });
        }
      },
      error: (err) => console.error('Error updating license:', err)
    });
  } else {
    this.licenseService.addLicense(licensePayload).subscribe({
      next: (response) => {
        const newLicenseId = response.licenseId;
        this.router.navigate(['/license-client-flow'], {
          queryParams: { licenseId: newLicenseId, userId: this.userId }
        });
      },
      error: (err) => console.error('Error adding license:', err)
    });
  }
}


  getFieldError(controlName: string): string {
    const displayName = this.fieldDisplayNames[controlName] || controlName;
    const field = this.licenseForm.get(controlName);
    if (field?.errors) {
      if (field.errors['required']) return `${displayName} is required`;
      if (field.errors['maxlength']) return `${displayName} is too long`;
      if (field.errors['pattern']) return `${displayName} is invalid`;
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.licenseForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
