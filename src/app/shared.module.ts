import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { VisionMaterialModule } from "./material-module";
import { TablerIconsModule } from "angular-tabler-icons";
import { MessageComponent } from "./components/layout/message/message.component";
import { TranslateModule } from "@ngx-translate/core";
import { SafeHtmlPipe } from "./safe-html.pipe";

@NgModule({
    imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule,
        VisionMaterialModule, TablerIconsModule, MessageComponent, TranslateModule, SafeHtmlPipe],
    declarations: [],
    exports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule,
        VisionMaterialModule, TablerIconsModule, MessageComponent, TranslateModule,SafeHtmlPipe],
})
export class SharedModule {

}