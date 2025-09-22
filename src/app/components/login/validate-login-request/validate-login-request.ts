import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { AuthStateService } from '../../../services/auth.state.service';
import { PlatformService } from '../../../services/platform.service';


@Component({
  selector: 'app-validate-login-request',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validate-login-request.html',
  styleUrl: './validate-login-request.scss'
})
export class ValidateLoginRequest implements OnInit {
  usernameForm: FormGroup;
  errorMessage: string = '';
  showError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private authStateService: AuthStateService,
    private platformService: PlatformService,
  )
  {
    this.authStateService.clearLoginData();
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {

  }

  onSubmit() {
  this.showError = false;
  
  if (this.usernameForm.invalid) {
    this.usernameForm.markAllAsTouched();

    if (this.usernameForm.get('username')?.invalid) {
      this.errorMessage = 'Wrong username, valid username is required.';
      this.showError = true;
    }

    return;
  }

  const username = this.usernameForm.value.username;
  const rememberMe = this.usernameForm.value.rememberMe;
  this.authService.validateLoginRequest(username).subscribe(
    (response: any) => {
      this.authStateService.setLoginData(username, response.temporaryToken, rememberMe);
      this.router.navigate(['/login']);
    },
    (error) => {
      this.showError = true;
      if (error.status === 400) {
        this.errorMessage = error.error?.message ?? 'Bad request. Please check your input.';
      } else {
        this.errorMessage = error.error?.message ?? `Server error: ${error.status}`;
      }
    }
  );
}
}

