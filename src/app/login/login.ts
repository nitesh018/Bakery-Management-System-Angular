import { Component } from '@angular/core';  // Component define karne ke liye
import { FormsModule } from '@angular/forms'; //(jaise input fields handle karna)
import { CommonModule } from '@angular/common'; //isme common directives hote hain jaise *ngIf, *ngFor, etc.
import { Router } from '@angular/router';
import { API_CONFIG } from '../config/api.config';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  userId: string = '';
  password: string = '';
  userIdError: string = '';
  passwordError: string = '';
  showPassword: boolean = false;
  isAdminLogin: boolean = false; // Toggle between user and admin login

  constructor(private router: Router) {}

  // User ID validation: 6-16 characters, alphanumeric
  validateUserId(): boolean {
    this.userIdError = '';
    
    if (!this.userId) {
      this.userIdError = 'User ID is required';
      return false;
    }
    
    if (this.userId.length < 6) {
      this.userIdError = 'User ID must be at least 6 characters';
      return false;
    }
    
    if (this.userId.length > 116) {
      this.userIdError = 'User ID must not exceed 16 characters';
      return false;
    }
    
    // Check if contains only alphanumeric characters
    // const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    // if (!alphanumericRegex.test(this.userId)) {
    //   this.userIdError = 'User ID can only contain letters and numbers';
    //   return false;
    // }
    
    return true;
  }

  // Password validation: 8-16 characters, starts with capital, contains special character
  validatePassword(): boolean {
    this.passwordError = '';
    
    if (!this.password) {
      this.passwordError = 'Password is required';
      return false;
    }
    
    if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      return false;
    }
    
    if (this.password.length > 116) {
      this.passwordError = 'Password must not exceed 16 characters';
      return false;
    }
    
    // Check if starts with capital letter
    if (!/^[A-Z]/.test(this.password)) {
      this.passwordError = 'Password must start with a capital letter';
      return false;
    }
    
    // Check if contains at least one special character
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(this.password)) {
      this.passwordError = 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\'"\\|,.<>\/?)';
      return false;
    }
    
    return true;
  }

  // Validate form on input change
  onUserIdChange() {
    if (this.userId) {
      this.validateUserId();
    } else {
      this.userIdError = '';
    }
  }

  onPasswordChange() {
    if (this.password) {
      this.validatePassword();
    } else {
      this.passwordError = '';
    }
  }

  // Toggle between user and admin login
  toggleLoginType(isAdmin: boolean) {
    this.isAdminLogin = isAdmin;
    // Clear form data when switching
    this.userId = '';
    this.password = '';
    this.userIdError = '';
    this.passwordError = '';
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    // Validate both fields before attempting login
    const isUserIdValid = this.validateUserId();
    const isPasswordValid = this.validatePassword();
    
    if (!isUserIdValid || !isPasswordValid) {
      console.log('Validation failed');
      return;
    }

    console.log('Login attempt:', {
      userId: this.userId,
      password: this.password,
      loginType: this.isAdminLogin ? 'admin' : 'user'
    });

    // Placeholder API call that the backend developer will connect later
    this.makeApiCall();
  }

  forgotPassword() {
    console.log(`Navigating to ${this.isAdminLogin ? 'admin' : 'user'} forgot password page`);
    // You can pass the login type as a query parameter
    this.router.navigate(['/forgot-password'], { 
      queryParams: { type: this.isAdminLogin ? 'admin' : 'user' } 
    });
  }

  goToSignup() {
    console.log('Navigating to user signup page');
    this.router.navigate(['/signup']);
  }

  private async makeApiCall() {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.userLogin}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: this.password,
          email: this.userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        
        // Store auth token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Redirect based on user type or to dashboard
        // this.router.navigate(['/dashboard']);
        alert('Login successful!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login failed:', errorData);
        alert(`Login failed: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection.');
    }
  }
}
