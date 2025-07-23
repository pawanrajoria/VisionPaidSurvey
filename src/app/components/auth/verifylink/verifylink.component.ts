import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStorageService } from "../../../localstorage.service";

@Component({
    selector: 'app-auth',
    imports: [SharedModule],
    template: ''
})
export class VerifyLinkComponent implements OnInit {
    idve: string = "";
    idvp: string = "";
    constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router,
        private localStorageService: LocalStorageService
    ) {
        this.route.paramMap.subscribe(params => {
            this.idve = params.get('idve') || "";
            this.idvp = params.get('idvp') || "";
        });
    }

    async ngOnInit() {
        const request = {
            idve: this.idve,
            idvp: this.idvp
        };
        const response = await this.authService.verifysignature(request);
        if (!!response && response.token) {
            this.localStorageService.setItem("token", response.token);
            this.router.navigate(['/app']);
        }
    }

}