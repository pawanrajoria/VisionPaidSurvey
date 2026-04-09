import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { AuthService } from "./auth.service";
import { Router, RouterOutlet } from "@angular/router";
import { RootFooterComponent } from "../root/root-footer/root-footer.component";

@Component({
    selector: 'app-auth',
    imports: [RouterOutlet,SharedModule,RootFooterComponent],
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