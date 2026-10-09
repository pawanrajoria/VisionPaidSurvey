import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PublicMaterialModule } from "./material-module";
import { TablerIconsModule } from "angular-tabler-icons";
import { MessageComponent } from "./components/layout/message/message.component";
import { TranslateModule } from "@ngx-translate/core";
import { SafeHtmlPipe } from "./safe-html.pipe";
import { RecaptchaV3Module } from "ng-recaptcha";

/**
 * PERF: Use this instead of SharedModule for public/SEO/marketing pages
 * (components/root/**, blog, guides, gift-cards). Same API surface as
 * SharedModule minus the heavy Material/CDK modules those pages don't use.
 * See material-module.ts (PublicMaterialModule) for what's included.
 */
@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule,
        PublicMaterialModule, TablerIconsModule, MessageComponent, TranslateModule, SafeHtmlPipe, RecaptchaV3Module],
    declarations: [],
    exports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule,
        PublicMaterialModule, TablerIconsModule, MessageComponent, TranslateModule, SafeHtmlPipe, RecaptchaV3Module],
})
export class PublicSharedModule {

}
