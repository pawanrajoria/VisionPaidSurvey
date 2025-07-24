import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class ZipService {

    zipCodes: Array<ZipFormat> = [];
    private httpClient: HttpClient;

    constructor(handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
        this.getZipCode("s");
    }

    public async getZipCode(sbc: string) {
        return this.httpClient.get<Array<ZipFormat>>('assets/zip.json').subscribe(async (data: Array<ZipFormat>) => {
            this.zipCodes = data;
        }, error => {
            this.zipCodes = [];
        });
    }
}

export interface ZipFormat {
    LanguageId: number,
    ErrorMessage: string,
    Country: string,
    ISO: string,
    Format: string,
    Regex: string
}
