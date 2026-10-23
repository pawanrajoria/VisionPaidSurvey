import { Component } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";

@Component({
    selector: 'app-root-puzzle-privacypolicy',
    imports: [PublicSharedModule],
    templateUrl: './root-puzzle-privacypolicy.html',
    styleUrls: ['../root-puzzle-datadeletion/puzzle-policy.scss']
})
export class RootPuzzlePrivacyPolicyComponent { }
