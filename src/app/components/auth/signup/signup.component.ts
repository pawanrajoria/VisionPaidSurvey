import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";

@Component({
    selector: 'app-signup',
    imports: [SharedModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignUpComponent implements OnInit {
    defaultAmount = "10";
    isAccepted = false;
    isResend = false;
    signUpForm!: FormGroup;
    constructor(private fb: FormBuilder, private message: MessageService, private authService: AuthService,
        private route: ActivatedRoute, private router: Router
    ) {
        this.signUpForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            isAccepted: [false, Validators.required],
            bonusCode: ['']
        });

        this.route.paramMap.subscribe(params => {
            const encrypted = params.get('id');
            if (encrypted) {
                this.signUpForm.get('email')?.setValue(this.authService.decrypt(decodeURIComponent(encrypted)));
            }
        });

        this.route.queryParams.subscribe(params => {
            const ref = params['referralCode'];
            if (ref) {
                this.signUpForm.get('bonusCode')?.setValue(ref);
            }
        });
    }

    ngOnInit(): void {
    }

    async submit() {
        const self = this;

        if (self.signUpForm?.invalid) return;

        const response = await self.authService.signup(self.signUpForm.value);
        if (!!response && response.isSuccess) {
            self.message.showMessage(new MessageVM(response.message, "success"));
            self.isResend = true;
        }
        else {
            self.message.showMessage(new MessageVM(response.message, "error"));
            self.router.navigateByUrl('/auth/login');
        }
    }

    async onResend() {
        const self = this;

        if (self.signUpForm?.invalid) return;

        const response = await self.authService.resendVerificationLink(self.signUpForm.value);
        if (!!response && response.isSuccess) {
            self.message.showMessage(new MessageVM(response.message, "success"));
            self.isResend = true;
        }
        else {
            self.message.showMessage(new MessageVM(response.message, "error"));
            self.router.navigateByUrl('/auth/login');
        }
    }
}