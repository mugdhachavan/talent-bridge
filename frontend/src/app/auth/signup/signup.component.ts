import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  profilePhoto: File | null = null;
  resume: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {
    // Initialize the signup form
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      skills: ['', Validators.required],
      degree: ['', Validators.required],
      institute: ['', Validators.required],
      year: ['', Validators.required]
    });
  }

  // Handle file selection
  onFileChange(event: Event, type: 'photo' | 'resume') {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    if (type === 'photo') this.profilePhoto = input.files[0];
    if (type === 'resume') this.resume = input.files[0];
  }

  // Handle form submission
  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    // Create FormData to send to backend
    const formData = new FormData();

    // Append form fields
    Object.keys(this.signupForm.value).forEach(key => {
      formData.append(key, this.signupForm.value[key]);
    });

    // Append files if present
    if (this.profilePhoto) formData.append('profilePhoto', this.profilePhoto);
    if (this.resume) formData.append('resume', this.resume);

    // Call signup API
this.authService.signup(formData).subscribe({
  next: (res: any) => {
    // ✅ Custom success alert
    this.alertService.success('Signup successful! Your account has been created.',3000 );

    // ✅ Optional redirect (after alert shows)
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  },
  error: (err: any) => {
    const message = err?.error?.message || 'Signup failed. Please try again.';
    this.alertService.error(message, 4000);
  }
});

  }
  navigateToLogIn() {
    this.router.navigate(['/login']);
  }
}
