import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api {
  constructor(private http: HttpClient) {}

  // ✅ Generic POST function — returns Promise<T>
  post<T>(baseUrl: string, endpoint: string, payload: any): Promise<T> {
    const fullUrl = `${baseUrl}${endpoint}`;
    return this.http.post<T>(fullUrl, payload).toPromise() as Promise<T>;
  }
}
