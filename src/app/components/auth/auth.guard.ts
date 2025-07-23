// import { CanActivateFn, Router } from "@angular/router";
// import { inject } from "@angular/core";
// import { AngularFireAuth } from "@angular/fire/compat/auth";
// import { Observable } from "rxjs";
// import { AuthService } from "./auth.service";


// export const authGuard: CanActivateFn = async (route, state) => {

//     const angularFireAuth = inject(AngularFireAuth);
//     const router = inject(Router);
//     const authService = inject(AuthService);
//     const isAuth = await authService.isAuthenticated();

//     return new Promise((resolve) => {
//         if (isAuth) {
//             resolve(true);
//         } else {
//             resolve(false);
//             router.navigate(['/login']);
//         }
//     });
// };

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class authGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(): Promise<boolean> {
        const isAuth = await this.authService.isAuthenticated();
        if (!isAuth) {
            this.router.navigate(['/auth/login']);
            return false;
        }
        return true;
    }
}