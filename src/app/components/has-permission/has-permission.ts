// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-has-permission',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './has-permission.html',
//   styleUrl: './has-permission.scss'
// })
// export class HasPermission {
// form!: FormGroup;
// fieldDisplayNames: { [key: string]: string } = { };
//  isFieldInvalid(fieldName: string): boolean {
//     const field = this.form.get(fieldName);
//     return !!(field && field.invalid && (field.dirty || field.touched));
//   }

//   getFieldError(fieldName: string): string {
//      const displayName = this.fieldDisplayNames[fieldName] || fieldName;
//     const field = this.form.get(fieldName);
//     if (field?.errors) {
//       if (field.errors['required']) return `${displayName}  is required`;
//       if (field.errors['url']) return 'Please enter a valid url';
//       if (field.errors['maxlength']) return `${displayName} is too long`;
//     }
//     return '';
//   }
// }



import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/Client/client-service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { License } from '../Models/license.models';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenseService } from '../../services/Licenses/licenseservice.service';

@Component({
  selector: 'app-has-permission',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './has-permission.html',
  styleUrls: ['./has-permission.scss']
})
export class HasPermission implements OnInit {
  form!: FormGroup;
    isRolesLoading = true;
    //roles: NetRoles[] = [];

  fieldDisplayNames: { [key: string]: string } = {
    hasPermissionLicense: 'Permission To License',
    urlLicense: 'URL',
     hasPermissionInvoice: 'Permission To Invoice',
    urlInvoice: 'URL',
  };
    licenses$!: Observable<License[]>;
    errors$: Observable<string[]> | undefined;
    licenseId: number = 0;

  constructor(private fb: FormBuilder, private clientService: ClientService,  private router: Router, private licenseService: LicenseService, private route:ActivatedRoute) {
    this.licenses$ = this.route.queryParams.pipe(
      switchMap(params => {
        this.licenseId = +params['licenseId'];
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

  ngOnInit() {
    this.form = this.fb.group({
      hasPermissionLicense: [false],
      urlLicense: [''],
      hasPermissionInvoice: [false],
      urlInvoice: [''],
     // roleExchange: [''],
     // roleInvoice: ['']
    });

     //this.loadRoles();

    this.form.get('hasPermissionLicense')?.valueChanges.subscribe(hasPermission => {
      const urlControl = this.form.get('urlLicense');
      const roleLicenseControl = this.form.get('roleLicense')
      if (hasPermission) {
        urlControl?.setValidators([
          Validators.required,
          Validators.pattern(/^(https?:\/\/)?([\w\-]+)+([\w\-\._~:/?#[\]@!$&'()*+,;=]+)?$/i) 
        ]);
        // roleExchangeControl?.setValidators([
        //   Validators.required 
        // ]);
      } else {
        urlControl?.clearValidators();
        urlControl?.setValue(''); 
      }
      urlControl?.updateValueAndValidity();
    });
    this.form.get('hasPermissionInvoice')?.valueChanges.subscribe(hasPermission => {
      const urlControl = this.form.get('urlInvoice');
      const roleInvoiceControl = this.form.get('roleInvoice')
      if (hasPermission) {
        urlControl?.setValidators([
          Validators.required,
          Validators.pattern(/^(https?:\/\/)?([\w\-]+)+([\w\-\._~:/?#[\]@!$&'()*+,;=]+)?$/i) 
        ]);
        //   roleInvoiceControl?.setValidators([
        //   Validators.required
        // ]);
      } else {
        urlControl?.clearValidators();
        urlControl?.setValue(''); // Optional: clear url value when no permission
      }
      urlControl?.updateValueAndValidity();
    });
  }

  // private loadRoles(): void {
  //     console.log('Loading roles...');
  //     this.isRolesLoading = true;
  
  //     this.clientService.getRoles().subscribe({
  //       next: (roles) => {
  //         console.log('Roles received:', roles);
  //         this.roles = roles;
  //         console.log('Role options:', this.roles);
  //         this.isRolesLoading = false;
  //       },
  //       error: (error) => {
  //         console.error('Error loading roles:', error);
  //         this.roles = [];
  //         this.isRolesLoading = false;
  //       }
  //     });
  //   }

    

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const displayName = this.fieldDisplayNames[fieldName] || fieldName;
    const field = this.form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${displayName} is required`;
      if (field.errors['pattern']) return 'Please enter a valid url';
      if (field.errors['maxlength']) return `${displayName} is too long`;
    }
    return '';
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted', this.form.value);
      // const exchangeClient: ExchangeClient = {
     // exchangeID: this.exchangeId,};
  //    this.exchangeClientService.addLicenseClient(licenseClient).subscribe({
  //   next: (res) => {
  //     const newLicenseClientId = res.licenseClientId; 
  //     console.log('Saved successfully', res);
  //     this.router.navigate(['/manage-clients'], {
  //   queryParams: { licenseId: this.licenseId, licenseClientId: newLicenseClientId }
  // });
  //   },
  //   error: (err) => {
  //     console.error('Error saving client', err);
  //   }
  // });
  //   } else {
  //     this.form.markAllAsTouched();
     }
   }
}
