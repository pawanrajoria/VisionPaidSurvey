// src/app/shared/pipes/safe-html.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'safeHtml',
    standalone: true // Mark as standalone pipe
})
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    /**
     * Transforms a string into a SafeHtml value.
     * This is used to display HTML content directly from translation strings
     * without Angular's default sanitization stripping the tags.
     * @param value The string containing HTML to be sanitized.
     * @returns A SafeHtml object.
     */
    transform(value: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }
}
