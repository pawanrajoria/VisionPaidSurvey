import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { VisionMaterialModule } from "./material-module";
import { TablerIconsModule } from "angular-tabler-icons";
import { MessageComponent } from "./components/layout/message/message.component";
import { TranslateModule } from "@ngx-translate/core";
import { SafeHtmlPipe } from "./safe-html.pipe";
import { RecaptchaV3Module } from "ng-recaptcha";

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule,
        VisionMaterialModule, TablerIconsModule, MessageComponent, TranslateModule, SafeHtmlPipe,RecaptchaV3Module],
    declarations: [],
    exports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule,
        VisionMaterialModule, TablerIconsModule, MessageComponent, TranslateModule,SafeHtmlPipe,RecaptchaV3Module],
})
export class SharedModule {

}