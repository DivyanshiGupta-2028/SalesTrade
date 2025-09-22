import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
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
export class AddLicense implements OnInit, OnDestroy{
  private destroy$ = new Subject<void>();
  licenseForm!: FormGroup;
 userId: string = '';
  currencies$!: Observable<Currencies[]>; 
  languages$!: Observable<Langauges[]>;
  countries$!: Observable<Country[]>;
  licenses$!: Observable<License[]>;
  isLoading = false;
  isClientAddressLoading = true;
  clientAddress: ClientAddress[] = [];
   pageTitle = 'Add License';
  pageSubtitle = '';
  showBackFlag = true;
  showSubtitle = true;
  
  countryOptions: { value: number, label: string }[] = [];
  timezoneOptions: any[] = [];
  isCountriesLoading = true;
  isTimezonesLoading = true;
  stateOptions: { value: string, label: string }[] = [];
  isStatesLoading = true;
  selectedCountries = 0;

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
  console.log('UserId from query params:', this.userId);
});


    this.licenses$ = this.licenseService.getParentLicenses();
    this.countries$ = this.licenseService.getCountrySelectedItems();
    this.languages$ = this.licenseService.getLangaugeSelectedItems();
    this.currencies$ = this.licenseService.getCurrencySelectedItems();
    this.initializeForm();
     this.loadCountries();
     this.licenseForm.get('licenseDuration')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(duration => {
      this.updateEndDateBasedOnDuration(duration);
    });

     this.licenseForm.get('country')?.valueChanges
       .pipe(takeUntil(this.destroy$))
       .subscribe((selectedCountry) => {
         if (selectedCountry) {
           this.selectedCountries = selectedCountry;
           this.loadStatesByCountry(selectedCountry);
         } else {
           this.stateOptions = [];
         }
       });
     this.licenses$.pipe(takeUntil(this.destroy$)).subscribe(licenses => {
    if (licenses && licenses.length > 0) {
      this.licenseForm.get('licenseParentId')?.setValue(licenses[0].licenseId);
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
    licenseParentId: ['', Validators.required],
    companyName: ['', Validators.required],
    licenseType:['standard', Validators.required],
    startDate: [formatDate(today, 'yyyy-MM-dd', 'en'), Validators.required],
    endDate: [formatDate(nextYear, 'yyyy-MM-dd', 'en'), Validators.required],
    licenseDuration: ['', Validators.required],
    renewal:['yes'],
    currency: ['USD', Validators.required],
    localization: ['en-US', Validators.required],
    country: ['', Validators.required],
    language: ['English', Validators.required],
    referencePrefix: ['', Validators.required],
    isActive: [true],
    dateCreated: [new Date()],
    addressLine1: ['',[Validators.required, Validators.maxLength(100)]],
    addressLine2: ['', [Validators.required,Validators.maxLength(100)]],
    addressLine3: ['', [Validators.required,Validators.maxLength(100)]],
    addressLine4: ['', Validators.maxLength(100)],
    state: ['', Validators.maxLength(100)],
    otherState:[''],
    pincode: ['', [Validators.required,Validators.maxLength(10)]],
    latitude: ['', [Validators.required,Validators.pattern(LATITUDE_PATTERN)]],
    longitude: ['', [Validators.required,Validators.pattern(LONGITUDE_PATTERN)]]
    });
  }


  updateEndDateBasedOnDuration(duration: string | null): void {
  if (!duration) {
    return;
  }

  const startDateControl = this.licenseForm.get('startDate');
  const endDateControl = this.licenseForm.get('endDate');

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


  private loadCountries(): void {
    console.log('Loading countries...');
    this.isCountriesLoading = true;

    this.clientService.getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries: any[]) => {
          console.log('Countries received:', countries);
          this.countryOptions = countries.map(country => ({
            value: country.id,
            label: country.name
          }));
          console.log('Country options:', this.countryOptions);
          this.isCountriesLoading = false;
        },
        error: (error) => {
          console.error('Error loading countries:', error);
          this.countryOptions = [];
          this.isCountriesLoading = false;
        }
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

addLicense(): void {
  if (this.licenseForm.valid) {
    //const selectedCountryId = this.licenseForm.value.country;
    //const selectedStateId = this.licenseForm.value.state;
    //const selectedCountry = this.countryOptions.find(c => String(c.value) === String(selectedCountryId));
   // const selectedState = this.stateOptions.find(c => String(c.value) === String(selectedStateId));

    const licenseData = {
      ...this.licenseForm.value,
     // country: selectedCountry ? selectedCountry.label : null,
     //state: selectedState ? selectedState.label : null,
      licenseParentId: this.licenseForm.value.licenseParentId,
      userId: this.userId
    };

    this.licenseService.addLicense(licenseData).subscribe({
      next: (response) => {
        const newLicenseId = response.licenseId;
        this.router.navigate(['/license-client-flow'], {
          queryParams: { licenseId: newLicenseId, userId: this.userId }
        });
      },
      error: (error) => console.error('Error adding License:', error)
    });
  } else {
    this.licenseForm.markAllAsTouched();
  }
}


  getFieldError(controlName: string): string {
    const displayName = this.fieldDisplayNames[controlName] || controlName;
    const field = this.licenseForm.get(controlName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${displayName} is required`;
      }
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['maxlength']) {
        return `${displayName} is too long`;
      }
    }
    return '';
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.licenseForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }
}
