import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Backend uses session cookies only; always send them
  req = req.clone({ withCredentials: true });
  return next(req);
};
