import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { EngagementService } from "../home/engagement/engagement.service";
import { AdminService } from "../admin/admin.service";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ConfigService } from "../../config.service";
import { firstValueFrom } from "rxjs";
import { Router } from "@angular/router";
import * as CryptoJS from 'crypto-js';
import { AccountService } from "../home/account.service";
import { LocalStorageService } from "../../localstorage.service";
import { isPlatformBrowser } from "@angular/common";
import { FraudService } from "../../frauddetection.service";


@Injectable({ providedIn: 'root' })
export class AuthService {
    private engagementService = inject(EngagementService);
    private adminService = inject(AdminService);
    private allowedMenus: string[] = [];
    private secretKey = "AADD654564ADD";
    private vi = "AADD654564ADD";

    constructor(private http: HttpClient, public angularFireAuth: AngularFireAuth,
        private config: ConfigService, private router: Router, private accountService: AccountService,
        private fraudService: FraudService,
        private localStorageService: LocalStorageService, @Inject(PLATFORM_ID) private platformId: Object) {

        // PERF: an empty authState subscription used to sit here. Its only effect was to boot
        // the Firebase Auth SDK (iframe + Google API scripts, ~130 KB) on every page that
        // injects this service, including the public home page. Firebase now starts only
        // when a Google sign-in is actually attempted.
    }

    async logOut(): Promise<void> {
        // await this.angularFireAuth.signOut();
        this.localStorageService.removeItem('google-token');
        this.localStorageService.removeItem('token');
        // Per-user session caches must not leak into the next login on this device.
        this.engagementService.clear();
        this.adminService.clear();
        if (isPlatformBrowser(this.platformId)) {
            try { sessionStorage.removeItem('onboardingSkipped'); } catch { }
        }
        this.router.navigate(['/auth/login']);
    }

    async getToken(): Promise<string> {
        // const googleUser = await firstValueFrom(this.angularFireAuth.authState);
        const dbToken = this.localStorageService.getItem('token');
        return dbToken || "";
    }

    async isAuthenticated(): Promise<boolean> {
        if (!isPlatformBrowser(this.platformId)) {
            return false;
        }

        // The previous expression, (googleUser && dbAuth) || dbAuth, always equals dbAuth,
        // so waiting for Firebase here only delayed the answer.
        return !!this.localStorageService.getItem('token'); // Check if database token exists
    }

    async firebaseLogin(request: any): Promise<any> {
        const response = await this.http.post<any>(this.config.baseUrl + "auth/firebase-login", request).toPromise();
        if (!!response && !!response.token) {

            this.localStorageService.setItem("token", response.token);
            this.router.navigate(['/app']);


            const fraudSignals: any = await this.fraudService.collectSignals();
            // if (fraudSignals && fraudSignals.decision === "BLOCK") {
            //     alert("Suspicious activity detected");
            // } 
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