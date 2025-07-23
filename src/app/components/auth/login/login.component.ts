import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleLoginDirective } from "../google.directive";
import { AuthService } from "../auth.service";
import { SharedDataService } from "../../../shared.data.service";


@Component({
    selector: 'app-login',
    imports: [SharedModule, GoogleLoginDirective],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    isEmailValidCheck: boolean = false;
    bonusCode: string = '';
    defaultAmount: string = "10";

    loginForm!: FormGroup;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,
        private sharedDataService: SharedDataService, private activatedRoute: ActivatedRoute) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.activatedRoute.queryParams.subscribe(params => {
            const ref = params['referralCode'];
            if (ref) {
                this.bonusCode = ref;
            }
        });

    }


    ngOnInit(): void {
    }

    async submit() {
        const self = this;
        if (self.loginForm.get('email')?.invalid) return;

        if (!self.isEmailValidCheck) {
            const response = await self.authService.loginbyemail({ email: self.loginForm.get('email')?.value });
            if (!!response && response) {
                self.isEmailValidCheck = true;
            }
            else {
                self.router.navigate(
                    ['/auth/signup', this.authService.encrypt(this.loginForm.get('email')?.value)],
                    { queryParams: { referralCode: self.bonusCode } } // 'ref' is the query param key
                );
            }
        }
        else {
            if (self.loginForm?.invalid) return;

            await self.authService.login(self.loginForm.value);
        }

    }

    forgotPassword() {
        const self = this;
        if (self.loginForm.get('email')?.invalid) {
            self.loginForm.markAllAsTouched();
            return;
        };

        this.sharedDataService.setData({ email: this.loginForm.get('email')?.value });
        self.router.navigate(['/auth/forgot-password']);
    }


}