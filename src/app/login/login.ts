import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  form: FormGroup;
  showPassword = false;
  isAdminLogin = false;
  loading = false;

  constructor(private router: Router, private auth: AuthService, private notify: NotificationService, fb: FormBuilder) {
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.form.controls; }
  toggleLoginType(isAdmin: boolean) { this.isAdminLogin = isAdmin; this.form.reset(); }
  togglePasswordVisibility() { this.showPassword = !this.showPassword; }

  async login() {
    if (this.form.invalid) { this.form.markAllAsTouched(); this.notify.error('Fix form'); return; }
    if (this.loading) return; // Prevent duplicate submissions
    this.loading = true;
    const creds = { email: this.f['email'].value.trim(), password: this.f['password'].value.trim() };
    try {
      const result = this.isAdminLogin ? await this.auth.adminLogin(creds) : await this.auth.userLogin(creds);
      if (result.success) {
        this.notify.success('Welcome');
        this.router.navigate([this.isAdminLogin ? '/admin-dashboard' : '/user-dashboard']);
      } else {
        this.notify.error(result.message || 'Wrong email or password');
      }
    } catch (e: any) { this.notify.error(e?.message || 'Wrong email or password'); }
    finally { this.loading = false; }
  }

  goToSignupPage() { this.router.navigate(['/signup']); }
  goToSignup() { this.goToSignupPage(); }
}
