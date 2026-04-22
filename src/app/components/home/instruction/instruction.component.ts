import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { ProfileService } from "../profile/profile.service";

@Component({
    selector: 'app-instruction',
    imports: [SharedModule],
    templateUrl: './instruction.component.html',
    styleUrls: ['./instruction.component.scss']
})
export class InstructionComponent {

    constructor(private profileervice: ProfileService) {
    }

    async proceedToNext() {
        await this.profileervice.markUserInstructed();
    }
}