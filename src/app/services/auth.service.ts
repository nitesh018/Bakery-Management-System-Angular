import { Injectable } from '@angular/core';
import { API_CONFIG } from '../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface LoginRequest { email: string; password: string; }
export interface AuthResult { success: boolean; message: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token'; // simple session marker
  private roleKey = 'user_role';
  private emailKey = 'user_email';

  constructor(private http: HttpClient) {}

  // Public wrappers
  adminLogin(creds: LoginRequest) { return this.login(creds, 'admin'); }
  userLogin(creds: LoginRequest) { return this.login(creds, 'user'); }

  // Added getToken for legacy checks
  getToken(): string | null { return sessionStorage.getItem(this.tokenKey); }

  // Added userRegister used in signup component
  async userRegister(data: { name: string; email: string; password: string; }): Promise<AuthResult> {
    try {
      const url = this.buildUrl(API_CONFIG.endpoints.userSignup);
      const resp: any = await firstValueFrom(this.http.post(url, data, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }));
      const msg: string = resp?.message || resp?.error || '';
      const ok = /success|registered|created/i.test(msg);
      return { success: ok, message: msg || (ok ? 'Signup successful' : 'Signup failed') };
    } catch (e: any) {
      return { success: false, message: e?.error?.error || e?.error?.message || 'Signup failed' };
    }
  }

  private buildUrl(endpoint: string): string {
    const base = (API_CONFIG.baseUrl || '').trim();
    if (!base) return endpoint; // dev proxy
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    const e = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return b + e;
  }

  private async login(creds: LoginRequest, role: 'admin' | 'user'): Promise<AuthResult> {
    try {
      const endpoint = role === 'admin' ? API_CONFIG.endpoints.adminLogin : API_CONFIG.endpoints.userLogin;
      const url = this.buildUrl(endpoint);
      console.log('Attempting login to:', url, 'with credentials:', creds);
      const resp: any = await firstValueFrom(this.http.post(url, creds, { 
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), 
        withCredentials: true,
        observe: 'response' // Get full response with headers
      }));
      
      console.log('Login response:', resp);
      const body = resp.body;
      const msg: string = body?.message || body?.error || '';
      const ok = /success/i.test(msg) || resp.status === 200;
      
      if (ok) {
        // Extract token from response if available
        const token = body?.token || body?.auth_token || resp.headers.get('Authorization') || 'session';
        sessionStorage.setItem(this.tokenKey, token);
        sessionStorage.setItem(this.roleKey, role);
        sessionStorage.setItem(this.emailKey, creds.email);
        console.log('Login successful, token stored:', token !== 'session' ? 'Token received' : 'Using session');
        return { success: true, message: msg || 'Login successful' };
      }
      return { success: false, message: msg || 'Login failed' };
    } catch (e: any) {
      console.error('Login error:', e);
      return { success: false, message: e?.error?.error || e?.error?.message || 'Login failed' };
    }
  }

  // Session helpers
  isLoggedIn(): boolean { return !!sessionStorage.getItem(this.tokenKey); }
  getUserRole(): string | null { return sessionStorage.getItem(this.roleKey); }
  getUserEmail(): string | null { return sessionStorage.getItem(this.emailKey); }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.roleKey);
    sessionStorage.removeItem(this.emailKey);
  }

  // Headers - include Authorization token if available
  getAuthHeaders(): HttpHeaders {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.getToken();
    if (token && token !== 'session') {
      return headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}
