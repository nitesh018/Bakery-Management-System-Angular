import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { API_CONFIG } from '../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Api } from '../services/api';

////////////////////////////////////////////////
@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  fullName: string = '';
  email: string = '';
  newUserId: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private http : HttpClient, private api : Api) {}

  signup() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Signup attempt:', {
      fullName: this.fullName,
      email: this.email,
      userId: this.newUserId,
      password: this.newPassword
    });

    // Placeholder API call for signup
    this.makeSignupApiCall();
  }

  goToLogin() {
    console.log('Navigating back to login page');
    this.router.navigate(['/login']);
  }

  private async makeSignupApiCall() {
    // try {
    //   const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.userSignup}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       name: this.fullName,
    //       email: this.email,
    //       password: this.newPassword
    //     })
    //   });

    //   if (response.ok) {
    //     const data = await response.json();
    //     console.log('Signup successful:', data);
    //     alert('Account created successfully! Please login.');
    //     this.router.navigate(['/login']);
    //   } else {
    //     const errorData = await response.json().catch(() => ({}));
    //     console.error('Signup failed:', errorData);
    //     alert(`Signup failed: ${errorData.message || response.statusText}`);
    //   }
    // } catch (error) {
    //   console.error('Network error:', error);
    //   alert('Network error. Please check your connection.');
    // 



    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const payload = {
        name: this.fullName,
          email: this.email,
          password: this.newPassword
    }
     this.api.post<any>(API_CONFIG.baseUrl, API_CONFIG.endpoints.userSignup, payload)
    .then(response => {
      console.log('Signup Successful:', response);
    })
    .catch(error => {
      console.error('Signup Failed:', error);
    });
  }

}
