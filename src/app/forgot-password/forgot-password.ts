import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  email: string = '';

  constructor(private router: Router) {}

  resetPassword() {
    console.log('Password reset request for:', this.email);
    
    // Placeholder API call for password reset
    this.makeResetApiCall();
  }

  goToLogin() {
    console.log('Navigating back to login page');
    this.router.navigate(['/login']);
  }

  private async makeResetApiCall() {
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: this.email
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Reset email sent:', data);
        alert(`Password reset instructions have been sent to ${this.email}. Please check your email.`);
        this.router.navigate(['/login']);
      } else {
        console.error('Reset failed:', response.statusText);
        alert('Unable to send reset email. Please check if the email is registered.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection.');
    }
  }
}
