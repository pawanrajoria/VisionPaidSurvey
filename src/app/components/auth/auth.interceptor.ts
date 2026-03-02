import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { from, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AccountService } from '../home/account.service';
import { MessageService } from '../layout/message/message.service';
import { MessageVM } from '../layout/message/message.vm';
import { LoaderService } from '../layout/loader.service';

const skipPatterns = [
  '/metrics',
  '/heartbeat',
  '/assets/',
  '.json',
  '.css',
  '.js',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.woff',
  '.ttf',
  '/auth/link' // ✅ skip SSR page route
];

const shouldSkipRequest = (req: HttpRequest<any>): boolean => {
  const acceptHeader = req.headers.get('Accept') || '';
  const isHtmlRequest = acceptHeader.includes('text/html');

  if (isHtmlRequest || req.headers.get('X-Skip-Loader') === 'true') return true;

  try {
    const url = new URL(req.url, 'http://localhost');
    return skipPatterns.some(pattern => url.pathname.includes(pattern));
  } catch {
    return skipPatterns.some(pattern => req.url.includes(pattern));
  }
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const authService = inject(AuthService);
  const accountService = inject(AccountService);
  const messageService = inject(MessageService);
  const router = inject(Router);

  const skipRequest = shouldSkipRequest(req);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // ✅ Skip for static, SSR, or explicitly excluded requests
  if (skipRequest) {
    return next(req.clone({
      headers: req.headers.set('X-Timezone', timezone)
    }));
  }

  return from(authService.getToken()).pipe(
    switchMap(authtoken => {
      const token = authtoken?.startsWith('"') && authtoken.endsWith('"')
        ? authtoken.slice(1, -1)
        : authtoken;

      const headers = req.headers
        .delete('X-Skip-Loader')
        .set('X-Timezone', timezone);

      const authHeaders = token ? headers.set('Authorization', `Bearer ${token}`) : headers;
      const modifiedReq = req.clone({ headers: authHeaders });

      loaderService.show();

      return next(modifiedReq).pipe(
        tap(event => {
          if (event instanceof HttpResponse) {
            // Handle response if needed
          }
        }),
        catchError(error => {
          // console.error('Interceptor Error:', error);

          if (error.status === 401 || error.status === 0) {
            messageService.showMessage(new MessageVM(
              error.status === 401 ? "Unauthorized! Redirecting to login..." : "Something went wrong.",
              "error"
            ));
            authService.logOut();
          } else if (error.error && typeof error.error === 'object' && 'message' in error.error) {
            messageService.showMessage(new MessageVM(error.error.message, "error"));
          } else {
            messageService.showMessage(new MessageVM("Some error occurred! Please try again later.", "error"));
          }

          return throwError(() => error);
        }),
        finalize(() => loaderService.hide())
      );
    })
  );
};
