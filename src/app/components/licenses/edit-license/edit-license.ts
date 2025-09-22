import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { ExchangeService } from '../exchangeservice.service';
import { MasterService } from '../../../services/master/master.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { Currencies } from '../../Models/currencies.models';
import { Langauges } from '../../Models/langauges.models';
import { Country } from '../../Models/country.models';
// import { Exchange } from '../../Models/Exchange.model';
import { ClientAddress } from '../../Models/Client.model';
import { ClientService } from '../../../services/Client/client-service';
import { License } from '../../Models/license.models';

@Component({
  selector: 'app-edit-license',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-license.html',
  styleUrls: ['./edit-license.scss']
})
export class EditLicense implements OnInit {
  licenseForm!: FormGroup;
  licenseId!: number;
  userId: string = '';
  currencies$!: Observable<Currencies[]>;
  languages$!: Observable<Langauges[]>;
  countries$!: Observable<Country[]>;
  parentLicenses$!: Observable<License[]>;
  parentLicenseName$!: Observable<string | undefined>;
  errorMessage: string = '';
      private destroy$ = new Subject<void>();
  
   // currencies$!: Observable<Currencies[]>; 
   // languages$!: Observable<Langauges[]>;
   // countries$!: Observable<Country[]>;
    licenses$!: Observable<License[]>;
      isLoading = false;
      isClientAddressLoading = true;
      clientAddress: ClientAddress[] = [];
    
      countryOptions: { value: number, label: string }[] = [];
      timezoneOptions: any[] = [];
      isCountriesLoading = true;
      isTimezonesLoading = true;
    
       stateOptions: { value: string, label: string }[] = [];
       isStatesLoading = true;
       selectedCountries = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private licenseService: LicenseService,
    private router: Router,
     public clientService: ClientService,
    private masterService: MasterService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
    this.loadDropdownData();

    this.route.paramMap.subscribe(params => {
      this.licenseId = +params.get('id')!;
      if (this.licenseId) {
        this.loadLicenseDetails(this.licenseId);
      }
    });

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
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }


  
      
  private initializeForm(): void {
    this.licenseForm = this.fb.group({
      companyName: [''],
      licenseParentId: [null],
      currency: [''],
      localization: [''],
      country: [''],
      language: [''],
      exchangeOwnerId: [''],
      referencePrefix: [''],
      dateCreated: [''],
      isActive: [false],
      licenseType:['', Validators.required],
      licenseDuration: ['', Validators.required],
      startDate:[ '', Validators.required],
      endDate:['', Validators.required],
      renewal:['yes'],
      addressLine1: ['',[Validators.required, Validators.maxLength(100)]],
      addressLine2: ['', [Validators.required,Validators.maxLength(100)]],
      addressLine3: ['', [Validators.required,Validators.maxLength(100)]],
      addressLine4: ['', Validators.maxLength(100)],
      state: ['', Validators.maxLength(100)],
      pincode: ['', [Validators.required,Validators.maxLength(10)]],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]

    });
  }

  loadDropdownData(): void {
    this.currencies$ = this.masterService.getCurrencySelectedItems();
    this.languages$ = this.masterService.getLangaugeSelectedItems();
    this.countries$ = this.masterService.getCountrySelectedItems();
    this.parentLicenses$ = this.licenseService.getParentLicenses();
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
  loadLicenseDetails(id: number): void {
    this.licenseService.getLicenseDetail(id).subscribe(data => {
      if (data) {
        this.licenseForm.patchValue({
         // userId: data.userId || '',
          companyName: data.companyName || '',
          licenseParentId: data.licenseParentId || null,
          currency: data.currency || '',
          localization: data.localization || '',
          country: data.country || '',
          language: data.language || '',
          licenseOwnerId: data.licenseOwnerId || '',
          referencePrefix: data.referencePrefix || '',
          dateCreated: data.dateCreated || '',
          isActive: data.isActive || false,
      licenseType: data.licenseType || '',
      licenseDuration:data.licenseDuration || '',
      startDate:data.start || '',
      endDate:data.expiry || '',
      renewal:data.renewal || '',
          addressLine1: data.addressLine1 || '',
    addressLine2: data.addressLine2 || '',
    addressLine3: data.addressLine3 || '',
    addressLine4: data.addressLine4 || '',
    state: data.state || '',
    pincode: data.pincode || '',
    latitude: data.latitude || '',
    longitude: data.longitude || '' });

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

  onSubmit(): void {
    const updatedExchange = { ...this.licenseForm.value, licenseId: this.licenseId, userId: this.userId };
    this.licenseService.updateLicense(updatedExchange).subscribe({
  next: (success: boolean) => {
    if(success) {
      this.router.navigate(['/license-client-flow'], {
        queryParams: { licenseId: this.licenseId }
      });
    }
  },
  error: (error) => console.error('Error adding License:', error)
});


  }
}
