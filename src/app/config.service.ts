import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private httpClient: HttpClient;
    private configs!: Configs;
    private platformId = inject(PLATFORM_ID);

    constructor(handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
    }

    get baseUrl() {
        return this.configs?.BaseUrl  || "https://apicrtool.azurewebsites.net/api/";
    }

    get appUrl() {
        return this.configs?.AppUrl;
    }

    get hostingDomain() {
        return this.configs?.HostingDomain;
    }

    get userflowEndpoint() {
        return this.configs?.UserflowEndpoint;
    }

    public async loadConfigs(): Promise<void> {
        if (isPlatformServer(this.platformId)) {
            this.configs = {
                BaseUrl: '',
                AppUrl: '',
                HostingDomain: '',
                UserflowEndpoint: ''
            };
            return;
        }

        try {
            this.configs = await firstValueFrom(
                this.httpClient.get<Configs>('assets/config.json')
            );
        } catch (error) {
            console.error('Error loading configuration:', error);
            this.configs = {
                BaseUrl: '',
                AppUrl: '',
                HostingDomain: '',
                UserflowEndpoint: ''
            };
        }
    }
}

export interface Configs {
    BaseUrl: string;
    AppUrl: string;
    HostingDomain: string;
    UserflowEndpoint: string;
}
