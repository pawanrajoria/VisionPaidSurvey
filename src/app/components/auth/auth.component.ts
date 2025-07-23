import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-auth',
    imports: [SharedModule],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) {
    }


    async ngOnInit() {
        const isAuth = await this.authService.isAuthenticated();
        if (isAuth) {
            this.router.navigate(['/app']);
        }
    }

}