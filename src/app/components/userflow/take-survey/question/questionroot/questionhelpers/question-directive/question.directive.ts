import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[questionRoot]'
})
export class QuestionRootDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}
