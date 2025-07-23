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

const shouldSkipLoader = (req: HttpRequest<any>): boolean => {
    // Option 1: Custom header
    if (req.headers.get('X-Skip-Loader') === 'true') return true;

    // Option 2: Match by URL
    const skipPatterns = ['/metrics', '/heartbeat'];
    return skipPatterns.some(pattern => req.url.includes(pattern));
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const loaderService = inject(LoaderService);
    const authService = inject(AuthService);
    const accountService = inject(AccountService);
    const messageService = inject(MessageService);
    const router = inject(Router);

    const skipLoader = shouldSkipLoader(req);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return from(authService.getToken()).pipe(
        switchMap(authtoken => {
            const headers = req.headers
                .delete('X-Skip-Loader') // Remove before sending to backend
                .set('X-Timezone', timezone);

            const token = authtoken?.startsWith('"') && authtoken.endsWith('"')
                ? authtoken.slice(1, -1)
                : authtoken;

            const authHeaders = token ? headers.set('Authorization', `Bearer ${token}`) : headers;
            const modifiedReq = req.clone({ headers: authHeaders });

            if (!skipLoader) loaderService.show();

            return next(modifiedReq).pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        // const menuHeader = event.headers.get('X-User-Menus');
                        // if (menuHeader) {
                        //     const allowedMenus = JSON.parse(menuHeader);
                        //     accountService.setAllowedMenus(allowedMenus);
                        // }

                        // const userBalance = event.headers.get('X-User-Balance');
                        // if (userBalance) {
                        //     const balance = JSON.parse(userBalance);
                        //     accountService.setUserBalance(balance.Balance);
                        //     accountService.setConvertedBalance(balance.CurrencyAmount);
                        // }
                    }
                }),
                catchError(error => {
                    console.error('Interceptor Error:', error);
                    if (error.status === 401 || error.status === 0) {
                        messageService.showMessage(new MessageVM(
                            error.status === 401 ? "Unauthorized! Redirecting to login..." : "Something went wrong.",
                            "error"
                        ));
                        authService.logOut();
                        router.navigate(['/auth/login']);
                    } else if (!!error.error) {
                        messageService.showMessage(new MessageVM(error.error, "error"));
                    } else {
                        messageService.showMessage(new MessageVM("Some error occurred! Please try again later.", "error"));
                    }
                    return throwError(() => error);
                }),
                finalize(() => {
                    if (!skipLoader) loaderService.hide();
                })
            );
        })
    );
};