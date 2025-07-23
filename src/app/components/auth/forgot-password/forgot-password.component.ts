import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";
import { SharedDataService } from "../../../shared.data.service";

@Component({
    selector: 'app-forgot-password',
    imports: [SharedModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
    isSuccess = false;
    userEmail: string = "";
    defaultAmount = "10";
    constructor(private sharedDataService: SharedDataService, private authService: AuthService,
        private message: MessageService, private router: Router
    ) {
    }

    async ngOnInit() {
        const self = this;
        self.userEmail = self.sharedDataService.getData()?.email;
        if (!self.userEmail) {
           self.router.navigateByUrl('/auth/login');
           return;
        }

        const response = await self.authService.resetPassword({ email: self.userEmail });
        if (!!response && !!response.message) {
            self.isSuccess = true;
            self.message.showMessage(new MessageVM(response.message, "success"));
        }
    }
}