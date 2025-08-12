import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export interface ApiError { status: number; message: string; path?: string; timestamp?: string; }

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const apiError: ApiError = {
        status: err.status,
        message: err.error?.message || err.message || 'Unexpected error',
        path: req.url,
        timestamp: new Date().toISOString()
      };

      // Determine suppression rules
      let suppress = (apiError.status === 404 || apiError.status === 400) && /\/user\/cart\/(view)?/.test(apiError.path || '');
      const isLoginEndpoint = /\/(admin|user)\/login$/.test(apiError.path || '');

      // Friendly message for invalid credentials
      if (isLoginEndpoint && apiError.status === 400) {
        apiError.message = 'Wrong email or password';
        // Suppress here so only component-level handler can show one toast
        suppress = true;
      }

      if (!suppress) {
        if (apiError.status >= 500) notify.error('Server error');
        else if (apiError.status === 0) notify.error('Network error');
        else if (apiError.status === 401) notify.warning('Unauthorized');
        else notify.error(apiError.message);
      }
      return throwError(() => apiError);
    })
  );
};
