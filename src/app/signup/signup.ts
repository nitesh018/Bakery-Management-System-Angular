import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  form: FormGroup;
  loading = false;

  constructor(private router: Router, private authService: AuthService, private notify: NotificationService, fb: FormBuilder) {
    this.form = fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: [this.passwordsMatchValidator] });
  }

  get f() { return this.form.controls; }

  passwordsMatchValidator(group: AbstractControl) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  async signup() {
    if (this.form.invalid) { this.form.markAllAsTouched(); this.notify.error('Fix form errors'); return; }
    this.loading = true;
    const payload = { name: this.f['fullName'].value, email: this.f['email'].value, password: this.f['newPassword'].value };
    try {
      const result = await this.authService.userRegister(payload);
      if (result.success) { this.notify.success('Account created. Login now.'); this.goToLogin(); }
      else { this.notify.error(result.message || 'Signup failed'); }
    } catch { this.notify.error('Network error'); }
    finally { this.loading = false; }
  }

  goToLogin() { this.router.navigate(['/login']); }
  clearForm() { this.form.reset(); }
}
