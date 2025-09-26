import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserBarControl } from '../../user-bar-control/user-bar-control';
import { CommonModule, formatDate } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { catchError, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { Currencies } from '../../Models/currencies.models';
import { Langauges } from '../../Models/langauges.models';
import { License } from '../../Models/license.models';
import { Country } from '../../Models/country.models';
import { LicenseService } from 'src/app/services/Licenses/licenseservice.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ClientService } from 'src/app/services/Client/client-service';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseClientService } from 'src/app/services/Licenses/license-client-service';

@Component({
  selector: 'app-license-flow',
  standalone:true,
  imports: [CommonModule,
     ReactiveFormsModule,
  UserBarControl,
     MatCheckboxModule,
   ],
  templateUrl: './license-flow.html',
  styleUrl: './license-flow.scss'
})
export class LicenseFlow implements OnInit, OnDestroy {
   private destroy$ = new Subject<void>();
   pageTitle = ' Bussiness Details';
  pageSubtitle = '';
  licenseName = '';
  showBackFlag = true;
  showSubtitle = true;
   showLicenseName = true;


   form!: FormGroup;
  currentStep: number = 1;
userId: string = '';
  licenseId: number = 0;
  currencies$!: Observable<Currencies[]>;
    languages$!: Observable<Langauges[]>;
    countries$!: Observable<Country[]>;
    licenses$!: Observable<License[]>;
    parentLicenses$!: Observable<License[]>;
  parentLicenseName$!: Observable<string | undefined>;
  errorMessage: string = '';
  errors$: Observable<string[]> | undefined;
  licenseClientId: number = 0;

  isLoading = false;
  isCountriesLoading = true;
  isStatesLoading = true;
  
  countryOptions: { value: number, label: string }[] = [];
  stateOptions: { value: string, label: string }[] = [];
  selectedCountries = 0;

  selectedCountry: string | null = null;


 wordCount: number = 0;
  profileDescriptionWordCount: number = 0;
  suggestedWebsites: string[] = [];

    fieldDisplayNames: { [key: string]: string } = {
    addressLine1: 'Address Line 1',
    addressLine2: 'Address Line 2',
    addressLine3: 'Address Line 3',
    country: 'Country',
    state:'State',
    pincode: 'PinCode'
  };


  constructor(private fb: FormBuilder,
    private licenseService: LicenseService,
    private masterService: MasterService,
    public clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private licenseClientService: LicenseClientService
  ) { 
    this.licenses$ = this.route.queryParams.pipe(
    switchMap(params => {
      this.licenseId = +params['licenseId'];
      this.userId = params['userId'];
      if (this.userId) {
          this.licenseService.getUserDetail(this.userId).subscribe(userProfile => {
    this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
  });
  }
       if (this.licenseId) {
          this.loadBusinessDetails(this.licenseId);
          this.licenseService.getLicenseDetail(this.licenseId).subscribe(license => {
            this.licenseName = `${license.companyName}`;
          });
        }
      return this.licenseService.getLicenseDetail(this.licenseId).pipe(
        map(license => license ? [license] : []), 
        catchError(error => {
          console.error('Error fetching license details:', error);
          this.errors$ = of(['Error fetching license details']);
          return of([]);
        })
      );
    })
  );
}
  

  ngOnInit(): void{

        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
          this.userId = params['userId'] || '';
          if (this.userId) {
            this.licenseService.getUserDetail(this.userId).subscribe(userProfile => {
      this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
    });
    }
        });
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
          if (this.licenseId) {
          this.loadBusinessDetails(this.licenseId);
          this.licenseService.getLicenseDetail(this.licenseId).subscribe(license => {
            this.licenseName = `${license.companyName}`;
          });
        }
        });
    
        this.form.get('step4.licenseDuration')?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(duration => {
            this.updateEndDateBasedOnDuration(duration);
          });

          this.form.get('step1.businessName')?.valueChanges.subscribe(value => {
  const acronym = this.generateAcronym(value);
  this.form.get('step3.referencePrefix')?.setValue(acronym, { emitEvent: false });
});

    
    
        this.form.get('step2.country')?.valueChanges
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
    const todayT = new Date().toISOString().substring(0, 10);
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    this.form = this.fb.group({
      step1: this.fb.group({
        businessName: ['', Validators.required],
        legalName: ['', Validators.required],
        businessType: ['', Validators.required],
        taxReferenceGeneral: ['', Validators.required],
        taxReferenceSales: ['', Validators.required],
        kyc: ['', Validators.required],
        cashRevenue: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
        total12MonthIncome: ['', Validators.required],
        numberOfEmployee: ['', Validators.required],
        businessStartDate: [''],
        lastRenewedDate: [todayT],
        dateRenewal: [''],
      }, { validators: this.dateOrderValidator }),
      step2: this.fb.group({
        addressLine1: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        addressLine2: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        addressLine3: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        addressLine4: ['', Validators.pattern(/^[a-zA-Z0-9]+$/)],
        country: ['', Validators.required],
        state: ['', Validators.required],
        otherState: [''],
        pincode: ['', [Validators.required, Validators.maxLength(10)]],
      }),
      step3: this.fb.group({
        website: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
       // mobile: [''],
        profileDescription: ['', Validators.required],
        currency: ['USD', Validators.required],
        language: ['English', Validators.required],
        localization: ['en-US', Validators.required],
       referencePrefix: ['', Validators.required],
        isActive: [false],
      }),
      step4: this.fb.group({
        licenseType: ['standard', Validators.required],
        licenseDuration: ['', Validators.required],
        startDate: [formatDate(today, 'yyyy-MM-dd', 'en'), Validators.required],
        endDate: [formatDate(nextYear, 'yyyy-MM-dd', 'en'), Validators.required],
        renewal: ['yes'],
        currentStatus: [''],
        isLegalDocumentationHeld: [''],
        isTaxReportingExempt: [''],
        canSendMessages: [''],
        canReceiveMessages: [''],
        isListedInDirectory: [''],
        isListedOnWebsite: [''],
        isActive: [''],
        isLicenseMember: [''],
        hasPermissionToUseInvoiceSystem: [''],
      }),
    });

    this.form.get('step2.country')?.valueChanges.subscribe(val => {
      this.selectedCountry = val;

      this.form.get('website')?.valueChanges.subscribe(value => {
   const control = this.form.get('website');
   if (value && !value.startsWith('http') && !value.startsWith('https')) {
     const updated = `https://www.${value.replace(/^www\./, '')}`;
     control?.setValue(updated, { emitEvent: false }); 
   }
 });
    });

    this.form.get('businessName')?.valueChanges.subscribe(value => {
      const acronym = this.generateAcronym(value);
      this.form.get('referencePrefix')?.setValue(acronym, { emitEvent: false });
    });
  }

  
  generateAcronym(name: string): string {
  if (!name) return '';

  const excludeWords = ['and', 'of', 'the', 'a', 'an', 'in', 'on'];
  return name
    .toLowerCase()
    .split(/[\s\-]+/) 
    .filter(word => word.length > 0 && !excludeWords.includes(word))
    .map(word => word[0].toUpperCase())
    .join('');
}


  loadBusinessDetails(licenseId: number): void {
  this.licenseClientService.getBusinessDetail(licenseId).subscribe(data => {
    if (data) {
      this.licenseClientId = data.licenseClientId;
      this.form.patchValue({
        step1: {
          businessName: data.businessName || '',
          legalName: data.legalName || '',
          businessType: data.businessType || '',
          taxReferenceGeneral: data.taxReferenceGeneral || '',
          taxReferenceSales: data.taxReferenceSales || '',
          kyc: data.kyc || '',
          cashRevenue: data.cashRevenue || null,
          total12MonthIncome: data.total12MonthIncome || null,
          numberOfEmployee: data.numberOfEmployee || '',
           dateRenewal: data.renewal || '',
          lastRenewedDate: data.lastRenewed || '',
          businessStartDate: data.businessStarted || ''

        },
        step3: {
          website: data.website || '',
          profileDescription: data.profileDescription || ''
        },

        step5: {
          currentStatus: data.currentStatus || '',
          isLegalDocumentationHeld: data.isLegalDocumentationHeld || '',
          isTaxReportingExempt: data.isTaxReportingExempt || '',
          canSendMessages: data.canSendMessages || '',
          canReceiveMessages: data.canReceiveMessages || '',
          isListedInDirectory: data.isListedInDirectory || '',
          isListedOnWebsite: data.isListedOnWebsite || '',
          isActive: data.isActive || '',
          isLicenseMember: data.isLicenseMember || '',
          hasPermissionToUseInvoiceSystem: data.hasPermissionToUseInvoiceSystem || ''
        }
      });
    } else {
      console.log('No business data found') 
    }
  }, error => {
    console.log('Error fetching business details.');
  });
}
  loadLicenseDetails(id: number): void {
    this.licenseService.getLicenseDetail(id).subscribe(data => {
      if (data) {
        
        this.form.get('step2')?.patchValue({
         
          addressLine1:  data.addressLine1 || '',
        addressLine2:  data.addressLine2 || '',
        addressLine3:  data.addressLine3 || '',
        addressLine4:  data.addressLine4 || '',
        country: data.country || '',
        state:  data.state || '',
        otherState:  data.otherState || '',
        pincode: data.pincode || '',

        });
  
        this.form.get('step3')?.patchValue({
          currency: data.currency || '',
          language: data.language || '',
          localization: data.localization || '',
          referencePrefix: data.referencePrefix || '',
          isActive: data.isActive ?? false
        });

        this.form.get('step4')?.patchValue({
          licenseType:  data.licenseType || '',
        licenseDuration: data.licenseDuration || '',
        startDate:  data.start || '',
        endDate:  data.expiry || '',
        renewal:  data.renewal || '',
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
  
  
//     nextStep(): void {
  
//     const stepGroup = this.form.get(`step${this.currentStep}`);
// if (stepGroup?.invalid) {
//     stepGroup.markAllAsTouched(); 
//     return; 
//   }

//     if (stepGroup?.valid) {
//       this.currentStep++;
//     }
//   }

  
 nextStep(): void {
  const stepGroup = this.form.get(`step${this.currentStep}`) as FormGroup | null;

  if (!stepGroup) return;

  // Mark all controls in the current step group as touched and dirty to trigger validation messages
  stepGroup.markAllAsTouched();
  Object.keys(stepGroup.controls).forEach(controlName => {
    const control = stepGroup.get(controlName);
    control?.markAsDirty();
  });

  // After marking, check validity to allow step navigation
  if (stepGroup.valid) {
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
  const startDateControl = this.form.get('step4.startDate');
  const endDateControl = this.form.get('step4.endDate');

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
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

   const step2 = this.form.value.step2;

  const licensePayload = {
  ...this.form.value.step1,
  ...step2,
  ...this.form.value.step3,
  ...this.form.value.step4,
  userId: this.userId,
   startDate: this.formatDateOnly(this.form.value.step4.startDate), 
  endDate: this.formatDateOnly(this.form.value.step4.endDate),
  dateCreated: this.licenseId ? undefined : new Date(),
  pincode: String(step2.pincode), 
};


  if (this.licenseId) {
    licensePayload['licenseId'] = this.licenseId;
    this.licenseService.updateLicenseFlow(licensePayload).subscribe({
      next: (success: boolean) => {
        if (success) {
          this.router.navigate(['/license-list'], {
            queryParams: { licenseId: this.licenseId, userId: this.userId }
          });
        }
      },
      error: (err) => console.error('Error updating license:', err)
    });
  } else {
    this.licenseService.addLicenseFlow(licensePayload).subscribe({
      next: (response) => {
        const newLicenseId = response.licenseId;
        this.router.navigate(['/license-list'], {
          queryParams: { licenseId: newLicenseId, userId: this.userId }
        });
      },
      error: (err) => console.error('Error adding license:', err)
    });
  }
}
getFieldError(fieldName: string): string {
    const displayName = this.fieldDisplayNames[fieldName] || fieldName;
    const field = this.form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${displayName} is required`;
      if (field.errors['maxlength']) return `${displayName} is too long`;
      if (field.errors['pattern']) return `${displayName} is invalid`;
    }
    return '';
  }

  getControlError(controlName: string): string {
    const displayName = this.fieldDisplayNames[controlName] || controlName;
    const field = this.form.get(controlName);
    if (field?.errors) {
      if (field.errors['required']) return `${displayName} is required`;
      if (field.errors['maxlength']) return `${displayName} is too long`;
      if (field.errors['pattern']) return `${displayName} is invalid`;
    }
    return '';
  }


  dateOrderValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const businessStartDate = group.get('businessStartDate')?.value;
  const lastRenewedDate = group.get('lastRenewedDate')?.value;
  const dateRenewal = group.get('dateRenewal')?.value;

  if (!businessStartDate || !lastRenewedDate || !dateRenewal) {
    return null;
  }

  const start = new Date(businessStartDate);
  const last = new Date(lastRenewedDate);
  const renewal = new Date(dateRenewal);

  if (start >= last) {
    group.get('businessStartDate')?.setErrors({ afterLastRenewed: true });
    return { invalidOrder: true };
  }

  if (last >= renewal) {
    group.get('lastRenewedDate')?.setErrors({ afterRenewal: true });
    return { invalidOrder: true };
  }

  return null; 
};


  getCurrentStepGroup(): FormGroup {
    return this.form.get('step' + this.currentStep) as FormGroup;
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
  const control = this.form.get(fieldName);
  return !!(control && control.invalid && (control.dirty || control.touched));
}


      onWebsiteInput() {
    const value = this.form.get('step3.website')?.value;
    this.suggestedWebsites = value && !value.startsWith('http')
      ? [`http://${value}`, `https://${value}`]
      : [];
  }

  get step1(): FormGroup {
    return this.form.get('step1') as FormGroup;
  }
 
  get step2(): FormGroup {
    return this.form.get('step2') as FormGroup;
  }
 
  get step3(): FormGroup {
    return this.form.get('step3') as FormGroup;
  }
 
  get step4(): FormGroup {
    return this.form.get('step4') as FormGroup;
  }
 
  get step5(): FormGroup {
    return this.form.get('step5') as FormGroup;
  }

  goToStep(step: number) {
    if (step >= 1 && step <= 4) {
    this.currentStep = step;
  }
 
  }

 
  updateWordCount() {
    const desc = this.form.get('step3.profileDescription')?.value || '';
    this.profileDescriptionWordCount = desc.trim().split(/\s+/).length;
  }
 
filterTextOnly(controlName: string) {
  const control = this.step3.get(controlName);
  if (control) {
    let value = control.value || '';
    value = value.replace(/[^a-zA-Z\s]/g, '');
    value = value.replace(/([a-zA-Z])\1{2,}/g, '$1$1');
 
    const words = value.trim().split(/\s+/);
    if (words.length > 500) {
      value = words.slice(0, 500).join(' ');
    }
 
    control.setValue(value, { emitEvent: false });
  }
 
  this.updateWordCount();
}


}








