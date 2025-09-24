import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseClientService } from '../../../services/Licenses/license-client-service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReferringClientModel } from '../../Models/ReferingClientModel';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { License } from '../../Models/license.models';
import { LicenseService } from '../../../services/Licenses/licenseservice.service';
import { LicenseClient } from '../../Models/LicenseClient';
import { UserBarControl } from '../../user-bar-control/user-bar-control';
 
 
 
@Component({
  selector: 'app-license-client-flow',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatSelectModule,
     MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
 UserBarControl
  ],
  templateUrl: './license-client-flow.html',
  styleUrl: './license-client-flow.scss'
})
export class LicenseClientFlow implements OnInit {
  form: FormGroup;
  wordCount: number = 0;
  profileDescriptionWordCount: number = 0;
  suggestedWebsites: string[] = [];
  referringClients: ReferringClientModel[] = [];
  highlightedIndex: number = -1;
  currentStep = 1;
  licenses$!: Observable<License[]>;
  errors$: Observable<string[]> | undefined;
  licenseId: number = 0;
  licenseClientId: number = 0;
   userId: string = '';

   pageTitle = ' Bussiness Details';
  pageSubtitle = '';
  licenseName = '';
  showBackFlag = true;
  showSubtitle = true;
   showLicenseName = true;

  clientNameValidator(validNames: string[]) {
  return (control: AbstractControl) => {
    const value = control.value?.trim();
    
    if (!value) {
      return { required: true }; 
    }
    
    if (!validNames.includes(value)) {
      return { invalidClientName: true };
    }
    
    return null; 
  };
}

 
  constructor(private fb: FormBuilder, private licenseClientService: LicenseClientService, private router: Router, private licenseService: LicenseService, private route:ActivatedRoute) {
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

this.licenses$.subscribe(licenses => {
  if (licenses.length) {
    this.form.get(['step4', 'dateRenewal'])?.setValue(licenses[0].expiry || '');
  }
});


const today = new Date().toISOString().substring(0, 10);
this.form = this.fb.group({
      step1: this.fb.group({
        businessName: ['', Validators.required],
        legalName: ['', Validators.required],
        businessType: ['', Validators.required],
        referingClientName: ['', [
      Validators.required,
      this.clientNameValidator(
  this.referringClients
    .map(c => c.referingClientName)
    .filter((name): name is string => name !== undefined)
)

    ]],
        referingClientId:['']
      }),
      step2: this.fb.group({
        taxReferenceGeneral: ['', Validators.required],
        taxReferenceSales: ['', Validators.required],
        kyc: ['', Validators.required],
        cashRevenue: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
       total12MonthIncome: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
        numberOfEmployee: ['', [Validators.required, Validators.min(1)]],
      }),
      step3: this.fb.group({
        website: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+$/)]],
        profileDescription: ['', [Validators.required, Validators.maxLength(500)]],
      }),
      step4: this.fb.group({
  dateRenewal: ['' ],
  lastRenewedDate: [today],
  businessStartDate: [''],
}, 
{ validators: this.dateOrderValidator }
),

      step5: this.fb.group({
        currentStatus: [false],
        isLegalDocumentationHeld: [false],
        isTaxReportingExempt: [false],
        canSendMessages: [false],
        canReceiveMessages: [false],
        isListedInDirectory: [false],
        isListedOnWebsite: [false],
        isActive: [true],
        isLicenseMember: [false],
        hasPermissionToUseInvoiceSystem: [false],
      })
    });
  }

ngOnInit(): void {
  this.referringClients = []; 
   
  this.licenseId = +this.route.snapshot.queryParams['licenseId'];
  this.userId = this.route.snapshot.queryParams['userId']|| '';
  console.log("userId",this.userId)
  if (this.licenseId) {
    this.loadBusinessDetails(this.licenseId);
    this.licenses$ = this.licenseService.getLicenseDetail(this.licenseId).pipe(
      map(license => license ? [license] : []),
      catchError(error => {
        console.error('Error fetching license details:', error);
        this.errors$ = of(['Error fetching license details']);
        return of([]);
      })
    );
  }
  this.step3.get('website')?.valueChanges.subscribe(value => {
   const control = this.step3.get('website');
   if (value && !value.startsWith('http') && !value.startsWith('https')) {
     const updated = `https://www.${value.replace(/^www\./, '')}`;
     control?.setValue(updated, { emitEvent: false }); // prevent loop
   }
 });
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


allowOnlyNumbers(event: KeyboardEvent) {
  if (!/[0-9]/.test(event.key)) {
    event.preventDefault();
  }
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
          referingClientId: data.referingClientId || '',
          referingClientName: data.referingClientName || ''
        },
        step2: {
          taxReferenceGeneral: data.taxReferenceGeneral || '',
          taxReferenceSales: data.taxReferenceSales || '',
          kyc: data.kyc || '',
          cashRevenue: data.cashRevenue || null,
          total12MonthIncome: data.total12MonthIncome || null,
          numberOfEmployee: data.numberOfEmployee || ''
        },
        step3: {
          website: data.website || '',
          profileDescription: data.profileDescription || ''
        },
        step4: {
          dateRenewal: data.renewal || '',
          lastRenewedDate: data.lastRenewed || '',
          businessStartDate: data.businessStarted || ''
        },
        step5: {
          currentStatus: data.currentStatus || false,
          isLegalDocumentationHeld: data.isLegalDocumentationHeld || false,
          isTaxReportingExempt: data.isTaxReportingExempt || false,
          canSendMessages: data.canSendMessages || false,
          canReceiveMessages: data.canReceiveMessages || false,
          isListedInDirectory: data.isListedInDirectory || false,
          isListedOnWebsite: data.isListedOnWebsite || false,
          isActive: data.isActive || false,
          isLicenseMember: data.isLicenseMember || false,
          hasPermissionToUseInvoiceSystem: data.hasPermissionToUseInvoiceSystem || false
        }
      });
    } else {
      console.log('No business data found') 
    }
  }, error => {
    console.log('Error fetching business details.');
  });
}


onClientInput(): void {
  const query = this.step1.get('referingClientName')?.value;
  if (query) {
    this.searchClients(query).subscribe(clients => {
      this.referringClients = clients;
      const control = this.step1.get('referingClientName');
      control?.setValidators([
  Validators.required,
  this.clientNameValidator(
    this.referringClients
      .map(c => c.referingClientName)
      .filter((name): name is string => name !== undefined)
  )
]);

      control?.updateValueAndValidity();
    });
  } else {
    this.referringClients = [];
    this.step1.get('referingClientId')?.setValue(null);
  }
  this.highlightedIndex = -1;
}
  searchClients(query: string): Observable<ReferringClientModel[]> {
    return this.licenseClientService.getReferringClients(query).pipe(
      switchMap(response => {
        if (!response || response.length === 0) {
          console.warn('No referring clients found.');
          return of([]);
        }
        return of(response);
      }),
      catchError(error => {
        console.error('Error fetching clients:', error);
        return of([]);
      })
    );
  }
    onWebsiteInput() {
    const value = this.form.get('step3.website')?.value;
    this.suggestedWebsites = value && !value.startsWith('http')
      ? [`http://${value}`, `https://${value}`]
      : [];
  }

onKeyDown(event: KeyboardEvent): void {
    const total = this.referringClients.length;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex = (this.highlightedIndex + 1) % total;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = (this.highlightedIndex - 1 + total) % total;
    } else if (event.key === 'Enter' && this.highlightedIndex >= 0) {
      this.selectClient(this.referringClients[this.highlightedIndex]);
    }
  }
 
 
selectClient(client: ReferringClientModel) {
  this.step1.get('referingClientName')?.setValue(client.referingClientName);
  this.step1.get('referingClientId')?.setValue(client.referingClientId);
  this.referringClients = [];
  this.highlightedIndex = -1;
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
 
  

  nextStep(): void {

  const stepGroup = this.form.get(`step${this.currentStep}`);
  if (stepGroup) {
    stepGroup.markAllAsTouched();
  }

  if (stepGroup?.valid) {
    this.currentStep++;
  }
}

 
  prevStep() {
    if (this.currentStep > 1) {
    this.currentStep--;
  }
  }
 
  goToStep(step: number) {
    if (step >= 1 && step <= 5) {
    this.currentStep = step;
  }
 
  }

submitForm() {
  if (this.form.valid) {
    console.log('Form submitted:', this.form.value);
    const licenseClient: LicenseClient = {
      licenseClientId: this.licenseClientId ,  
      userId: this.userId,
      licenseID: this.licenseId,
      businessName: this.step1.value.businessName,
      legalName: this.step1.value.legalName,
      businessType: this.step1.value.businessType,
      referingClientId: this.step1.value.referingClientId,
      referingClientName: this.step1.value.referingClientName,
      taxReferenceGeneral: this.step2.value.taxReferenceGeneral,
      taxReferenceSales: this.step2.value.taxReferenceSales,
      kyc: this.step2.value.kyc,
      cashRevenue: Number(this.step2.value.cashRevenue),
      total12MonthIncome: this.step2.value.total12MonthIncome,
      numberOfEmployee: this.step2.value.numberOfEmployee,
      website: this.step3.value.website,
      profileDescription: this.step3.value.profileDescription,
      dateRenewal: this.step4.value.dateRenewal,
      lastRenewedDate: this.step4.value.lastRenewedDate,
      businessStartDate: this.step4.value.businessStartDate,
      currentStatus: this.step5.value.currentStatus,
      isLegalDocumentationHeld: this.step5.value.isLegalDocumentationHeld,
      isTaxReportingExempt: this.step5.value.isTaxReportingExempt,
      canSendMessages: this.step5.value.canSendMessages,
      canReceiveMessages: this.step5.value.canReceiveMessages,
      isListedInDirectory: this.step5.value.isListedInDirectory,
      isListedOnWebsite: this.step5.value.isListedOnWebsite,
      isActive: this.step5.value.isActive,
      isLicenseMember: this.step5.value.isLicenseMember,
      hasPermissionToUseInvoiceSystem: this.step5.value.hasPermissionToUseInvoiceSystem,
      dateCreated: new Date(),
    };

    
    this.licenseClientService.addLicenseClient(licenseClient).subscribe({
      next: (res) => {
        const returnedLicenseClientId = res.licenseClientId || licenseClient.licenseClientId;
        console.log('Saved/Updated successfully', res);
        this.router.navigate(['/manage-clients'], {
          queryParams: { licenseId: this.licenseId, licenseClientId: returnedLicenseClientId , userId: this.userId}
        });
      },
      error: (err) => {
        console.error('Error saving/updating client', err);
      }
    });

  } else {
    this.form.markAllAsTouched();
  }
}


 
 
 
 
 
private markFormGroupTouched(formGroup: FormGroup | FormArray) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormGroup || control instanceof FormArray) {
      this.markFormGroupTouched(control);
    } else {
      control?.markAsTouched({ onlySelf: true });
    }
  });
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
 