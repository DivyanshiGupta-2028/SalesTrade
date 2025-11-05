import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UserBarControl } from '../../user-bar-control/user-bar-control';
import { CommonModule, formatDate } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { catchError, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Currencies } from '../../Models/currencies.models';
import { Langauges } from '../../Models/langauges.models';
import { License } from '../../Models/license.models';
import { Country } from '../../Models/country.models';
import { LicenseService } from 'src/app/services/Licenses/licenseservice.service';
import { MasterService } from 'src/app/services/master/master.service';
import { ClientService } from 'src/app/services/Client/client-service';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseClientService } from 'src/app/services/Licenses/license-client-service';
import { ChangeDetectionStrategy, model } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { RolesModel } from '../../Models/Admin.model';
import { AdminLicenseService } from 'src/app/services/Admin/admin-license-service.service';
import { UserProfile } from '../../Models/Client.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule,
    ReactiveFormsModule,
    UserBarControl,
    MatCheckboxModule,
    MatCardModule, MatDatepickerModule,
    MatInputModule, MatFormFieldModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

  templateUrl: './user-details.html',
  styleUrl: './user-details.scss'
})
export class UserDetails implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  pageTitle = ' User Details';
  pageSubtitle = '';
  licenseName = '';
  showBackFlag = true;
  showSubtitle = true;
  showLicenseName = true;
  selected = model<Date | null>(null);
  form!: FormGroup;
  currentStep: number = 1;
  userId: string = '';
  licenseId: number = 0;
  legalName?: string;
  countries$!: Observable<Country[]>;
 roles$: Observable<RolesModel[]> = undefined!;
  parentLicenses$!: Observable<License[]>;
  parentLicenseName$!: Observable<string | undefined>;
  errorMessage: string = '';
  errors$: Observable<string[]> | undefined;
  licenseClientId: number = 0;
  isLoading = false;
  isCountriesLoading = true;
  isStatesLoading = true;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
   user$: Observable<UserProfile | undefined> | undefined;
  countryOptions: { value: number, label: string }[] = [];
  stateOptions: { value: string, label: string }[] = [];
  selectedCountries = 0;

  selectedCountry: string | null = null;

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const date = d || new Date();
    date.setHours(0, 0, 0, 0); 
    return date <= today;
  };


  fieldDisplayNames: { [key: string]: string } = {
    addressLine1: 'Address Line 1',
    addressLine2: 'Address Line 2',
    addressLine3: 'Address Line 3',
    country: 'Country',
    state: 'State',
    pincode: 'PinCode'
  };


  constructor(private fb: FormBuilder,
    private licenseService: LicenseService,
    private adminService: AdminLicenseService,
    private masterService: MasterService,
    public clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private licenseClientService: LicenseClientService,
    private cdr: ChangeDetectorRef
  ) {
this.roles$ = this.adminService.getRoles();
// const state = this.router.getCurrentNavigation()?.extras.state;
//     if (state && state['email']) {
//       this.email = state['email'];
//     }
  }


  ngOnInit(): void {
    this.loadUserFromSession();
    console.log(this.email)
    //  if (!this.email && window.history.state?.email) {
    //   this.email = window.history.state.email;
      
    // }
    

    // If we have email, fetch user details
    if (this.email) {
      console.log('session get')
      this.user$ = this.licenseService.getUserDetailByMail(this.email).pipe(
      tap(  userProfile => {
        this.firstName = userProfile.firstName;
          this.lastName = userProfile.lastName;
          this.email = userProfile.email ;
          console.log(this.firstName, this.lastName, this.email)
          console.log('session get')
        }
      ),
          catchError(error => {
          console.error('Error fetching user details:', error);
          this.errors$ = of(['Error fetching user details']);
          return of(undefined);
        })
      )
    } else {
      this.errors$ = of(['No email provided']);
    }
   //  this.roles$ = this.adminService.getRoles();
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.userId = params['userId'] || '';
      // this.licenseId = params['licenseId'] || '';
      // this.licenseService.getLicenseDetail(this.licenseId).subscribe(license => {
      //   this.licenseName = `${license.companyName}`;
      //   this.cdr.markForCheck();
      // });
      if (this.userId) {
        this.licenseService.getUserDetail(this.userId).subscribe(userProfile => {
          this.pageSubtitle = `${userProfile.firstName} ${userProfile.lastName}`;
          this.firstName = userProfile.firstName;
          this.lastName = userProfile.lastName;
          this.email = userProfile.email;
          this.cdr.markForCheck();
          console.log(userProfile.firstName, userProfile.lastName, userProfile.email)

        });
      }
    });
    this.countries$ = this.licenseService.getCountrySelectedItems();
    // this.languages$ = this.licenseService.getLangaugeSelectedItems();
    // this.currencies$ = this.licenseService.getCurrencySelectedItems();
    //this.parentLicenses$ = this.licenseService.getParentLicenses();
    //this.roles$ = this.adminService.getRoles();
    this.initializeForm();
    this.loadCountries();

    this.route.queryParamMap.subscribe(params => {
      this.licenseId = +params.get('licenseId')!;

      if (this.licenseId) {
        this.loadLicenseAddressDetails(this.licenseId);
      }
      if (this.licenseId) {
        this.loadLicenseContactDetails(this.licenseId);
      }
      if (this.licenseId) {
        this.licenseService.getLicenseDetail(this.licenseId).subscribe(license => {
          this.licenseName = `${license.companyName}`;
        });
      }
    });

    this.form.get('step1.country')?.valueChanges.subscribe(countryIdRaw => {
      console.log('Country selected:', countryIdRaw);
      const countryId = Number(countryIdRaw);
      if (countryId) {
        this.selectedCountries = countryId;
        this.loadStatesByCountry(countryId);
      } else {
        this.stateOptions = [];
      }
      this.cdr.markForCheck();
    });



  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserFromSession(): void {
  const user = sessionStorage.getItem('userinfo');
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      if (parsedUser && parsedUser.id) {
        this.email = parsedUser.email || '';
        console.log('User loaded from session:', this.email); 
      }
    } catch (error) {
      console.error('Error parsing session user:', error);
    }
  }
}

  initializeForm(): void {
    const todayT = new Date().toISOString().substring(0, 10);
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    this.form = this.fb.group({
      
      step1: this.fb.group({
        addressLine1: ['', [Validators.required]],
        addressLine2: ['', [Validators.required]],
        addressLine3: ['', [Validators.required]],
        addressLine4: [''],
        country: ['', Validators.required],
        state: ['', Validators.required],
        otherState: [''],
        pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      }),
      step2: this.fb.group({
        mobile: ['', Validators.required],
        role: ['', Validators. required],
      }),
    });

    this.form.get('step1.country')?.valueChanges.subscribe(val => {
      this.selectedCountry = val;
    });
  }


  loadLicenseAddressDetails(id: number): void {
    this.licenseService.getLicenseAddressDetail(id).subscribe(data => {
      if (data) {

        this.form.get('step1')?.patchValue({

          addressLine1: data.addressLine1 || '',
          addressLine2: data.addressLine2 || '',
          addressLine3: data.addressLine3 || '',
          addressLine4: data.addressLine4 || '',
          country: data.country || '',
          state: data.state || '',
          otherState: data.otherState || '',
          pincode: data.pincode || '',
          isPrimary: data.isPrimary ?? false,

        });


      }
    }, error => {
      this.errorMessage = 'Error fetching License details.';
    });
  }


  loadLicenseContactDetails(id: number): void {
    this.licenseService.getLicenseContactDetail(id).subscribe(data => {
      if (data) {

        this.form.get('step3')?.patchValue({

          mobile: data.mobile || '',


        });

      }
    }, error => {
      this.errorMessage = 'Error fetching User details.';
    });
  }

  nextStep(): void {
    const stepGroup = this.form.get(`step${this.currentStep}`) as FormGroup;
    if (!stepGroup) return;

    stepGroup.markAllAsTouched();

    if (stepGroup.valid) {
      this.currentStep++;
    }
  }



  prevStep(): void {
    if (this.currentStep > 1) this.currentStep--;
  }


  private loadCountries(): void {
    this.isCountriesLoading = true;
    this.clientService.getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries: any[]) => {
          console.log('Countries order from API:', countries);
          this.countryOptions = countries.map(c => ({ value: c.id, label: c.name }));
          this.isCountriesLoading = false;
          this.cdr.markForCheck();
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
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading states:', error);
          this.stateOptions = [];
          this.isStatesLoading = false;
        }
      });
  }


  saveUserDetails(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log('Form Invalid:', this.form.errors, this.form.controls);
      this.cdr.markForCheck();
      return;
    }

    const step2 = this.form.value.step2;
   
  

    const userDetailPayload = {
      ...this.form.value.step1,
      ...step2,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      //pincode: String(step2.pincode),
    };

console.log('License Payload:', JSON.stringify(userDetailPayload, null, 2)); 
this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();    

// if (this.licenseId) {
//       userDetailPayload['licenseId'] = this.licenseId;
//       this.licenseService.updateLicenseFlow(userDetailPayload).subscribe({
//         next: (success: boolean) => {
//           if (success) {
//             this.currentStep = 5;
//             this.isLoading = false;
//             this.cdr.detectChanges();
//           }
//         },
//         error: (err) => {
//           this.errorMessage = 'Failed to update license: ' + (err.error?.title || 'Unknown error');
//           this.isLoading = false;
//           console.error('Error updating license:', err);
//           this.cdr.detectChanges(); 
//         }
//       });
//     } else {
//       this.adminService.addUserDetail(userDetailPayload).subscribe({
//         next: (response) => {
//           const newUserId = response.userId;
//           this.currentStep = 3;
//           this.isLoading = false;
//           this.cdr.detectChanges();
//         },
//         error: (err) => {
//           this.errorMessage = 'Failed to add license: ' + (err.error?.title || 'Unknown error');
//           this.isLoading = false;
//           console.error('Error adding license:', err);
//           this.cdr.detectChanges(); 
//         }
//       });
   // }
  }
  goToUserList(): void {
  this.router.navigate(['/user-list'], {
    queryParams: { userId: this.userId }
  });
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



  getCurrentStepGroup(): FormGroup {
    return this.form.get('step' + this.currentStep) as FormGroup;
  }

  allowOnlyNumbers(event: KeyboardEvent, maxLength: number) {
    const input = event.target as HTMLInputElement;

    if (/[0-9]/.test(event.key)) {
      if (input.value.length >= maxLength) {
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
  }


  allowNumbers(event: KeyboardEvent, maxLength: number) {
    const input = event.target as HTMLInputElement;

    if (/[0-9]/.test(event.key)) {
      if (input.value.length >= maxLength) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === '.' && !input.value.includes('.')) return;

    event.preventDefault();
  }



  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
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

  goToStep(step: number) {
    if (step >= 1 && step <= 2) {
      this.currentStep = step;
    }

  }


}








