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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // ✅ Correct initialization (no NG error)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        // ✅ Save token
        localStorage.setItem('token', res.token);

        // ✅ Notify auth state
        this.authService.setLoggedIn(true);

        alert('Login Successful');
        this.router.navigate(['/myprofile']);
      },
      error: (err) => {
        alert(err.error?.message || 'Login Failed');
      }
    });
  }
  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }
}
