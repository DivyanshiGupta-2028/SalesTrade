
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { PlatformService } from '../../../services/platform.service';
import { AuthStateService } from '../../../services/auth.state.service';

@Component({
  selector: 'app-validate-token-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validate-token-password.html',
  styleUrl: './validate-token-password.scss'
})
export class ValidateTokenPassword implements OnInit {
  passwordForm: FormGroup;
  errorMessage: string = '';
  showError: boolean = false;
  private username: string='';
  private tempToken: string = '';
  private rememberMe: boolean = false;
  showPassword = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private platformService: PlatformService,
    private authStateService: AuthStateService
  ) {

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.platformService.isBrowser()) {
      const loginData = this.authStateService.getLoginData();
      if (loginData.username && loginData.tempToken) {
        this.username = loginData.username;
        this.tempToken = loginData.tempToken;
        this.rememberMe = loginData.rememberMe == undefined ? false : loginData.rememberMe;
      }
      else {
        this.authStateService.clearLoginData();
        this.router.navigate(['/validate-login-request']);
      }
    }
  }

  onSubmit() {
    this.showError = false;
    if (this.passwordForm.invalid) {
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.get('password')?.invalid) {
      this.errorMessage = 'Wrong password, valid password is required.';
      this.showError = true;
    }

    return;
  }

    if (this.passwordForm.valid) {
      const password = this.passwordForm.value.password;
      this.authService.login(this.username, password, this.tempToken, this.rememberMe).subscribe(
        (response: any) => {
          this.authStateService.clearLoginData();
          this.router.navigate(['/loading']);
        },
        (error) => {
          this.showError = true;
          if (error.status === 400 && error.status ===404) {
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            }
            else {
              this.errorMessage = 'Bad request. Please check your input.';
            }
          }
          else {
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            }
            else {
              this.errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
            }
          }
        }
      );
    }
  }

}
