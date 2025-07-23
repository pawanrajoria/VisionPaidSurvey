import { HttpClient } from "@angular/common/http";
import { Injectable, PLATFORM_ID } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ConfigService } from "../../config.service";
import { firstValueFrom } from "rxjs";
import { Router } from "@angular/router";
import * as CryptoJS from 'crypto-js';
import { LoginTokenVM, RoleWiseModules } from "./module.vm";
import { AccountService } from "../home/account.service";
import { NavItem } from "../layout/sidebar/nav-item/nav-item";
import { isPlatformBrowser } from '@angular/common';
import { LocalStorageService } from "../../localstorage.service";


@Injectable({ providedIn: 'root' })
export class AuthService {
    private allowedMenus: string[] = [];
    private secretKey = "AADD654564ADD";
    private vi = "AADD654564ADD";

    constructor(private http: HttpClient, public angularFireAuth: AngularFireAuth,
        private config: ConfigService, private router: Router, private accountService: AccountService,
        private localStorageService: LocalStorageService) {
    }

    async logOut(): Promise<void> {
        await this.angularFireAuth.signOut();
        this.localStorageService.removeItem('google-token');
        this.localStorageService.removeItem('token');
        this.router.navigate(['/auth/login']);
    }

    async getToken(): Promise<string> {
        // const googleUser = await firstValueFrom(this.angularFireAuth.authState);
        const dbToken = this.localStorageService.getItem('token');
        return dbToken || "";
    }

    async isAuthenticated(): Promise<boolean> {
        const googleUser = await firstValueFrom(this.angularFireAuth.authState);
        const dbAuth = !!this.localStorageService.getItem('token'); // Check if database token exists
        return (!!googleUser && !!dbAuth) || (!!dbAuth);
    }

    async firebaseLogin(request: any): Promise<any> {
        const response = await this.http.post<any>(this.config.baseUrl + "auth/firebase-login", request).toPromise();
        if (!!response && !!response.token) {
            this.localStorageService.setItem("token", response.token);
            this.router.navigate(['/app']);
        }
    }

    async loginbyemail(request: any): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "auth/login-by-email", request).toPromise();
    }

    async login(request: any): Promise<any> {
        const response = await this.http.post<any>(this.config.baseUrl + "auth/login", request).toPromise();
        if (!!response && response.token) {
            this.localStorageService.setItem("token", response.token);
            this.router.navigate(['/app']);
        }
    }

    async signup(request: any): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "auth/signup", request).toPromise();
    }

    async verifysignature(request: any): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "auth/verify-signature", request).toPromise();
    }

    async resendVerificationLink(request: any): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "auth/resend-verification-link", request).toPromise();
    }


    async verifyForgotPassword(request: any): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "auth/verify-reset-signature", request).toPromise();
    }

    async resetPassword(request: any): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "auth/reset-password-link", request).toPromise();
    }

    encrypt(data: string) {
        return CryptoJS.AES.encrypt(data, this.secretKey).toString();
    }

    decrypt(encrypted: string) {
        const bytes = CryptoJS.AES.decrypt(encrypted, this.secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    get getCountryCode() {
        try {
            const locale = Intl.DateTimeFormat().resolvedOptions().locale;
            const countryCode = locale.split('-')[1];
            return countryCode || 'US'; // fallback to US
        } catch (e) {
            return 'US';
        }
    };
}