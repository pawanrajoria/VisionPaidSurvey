import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";
import { LocalStorageService } from "../../../localstorage.service";

@Component({
    selector: 'app-reset-password',
    imports: [SharedModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    defaultAmount = "10";
    rsetForm!: FormGroup;

    constructor(private fb: FormBuilder, private message: MessageService, private authService: AuthService,
        private route: ActivatedRoute, private router: Router, private localStorageService: LocalStorageService
    ) {
        this.rsetForm = this.fb.group({
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            idve: ['', Validators.required],
            idvp: ['', Validators.required]
        });

        this.route.paramMap.subscribe(params => {
            this.rsetForm.get('idve')?.setValue(params.get('idve') || "");
            this.rsetForm.get('idvp')?.setValue(params.get('idvp') || "");
        });
    }

    ngOnInit(): void {
    }

    async submit() {
        const self = this;

        if (self.rsetForm?.invalid) return;

        if (self.rsetForm.get('password')?.value !== self.rsetForm.get('confirmPassword')?.value) {
            return self.message.showMessage(new MessageVM("Password and Confirm Password do not match", "error"));
        }

        const response = await self.authService.verifyForgotPassword(self.rsetForm.value);
        if (!!response && response.token) {
            this.localStorageService.setItem("token", response.token);
            this.router.navigate(['/app']);
        }
    }
}