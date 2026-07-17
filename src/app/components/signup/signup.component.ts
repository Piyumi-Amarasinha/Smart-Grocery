import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;
  isSubmitting = false;
  signupError: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.signupForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  get f() {
    return this.signupForm.controls;
  }

  get passwordMismatch(): boolean {
    return (
      this.signupForm.hasError('passwordMismatch') &&
      this.f['confirmPassword'].touched
    );
  }

  onSubmit(): void {
    if (this.signupForm.invalid) return;
    this.isSubmitting = true;
    this.signupError = null;
    const { username, password } = this.signupForm.value;
    this.auth.register({ username, password }).subscribe({
      next: () => {
        this.successMessage = 'Account created! Redirecting to sign in...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.signupError = err?.error?.message ?? 'Registration failed. Please try again.';
      },
    });
  }
}
