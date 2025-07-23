import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    private httpClient: HttpClient;
    private configs!: Configs;

    constructor(handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
    }

    get baseUrl() {
        return this.configs?.BaseUrl;
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
        try {
            this.configs = await firstValueFrom(this.httpClient.get<Configs>('assets/config.json'));
        } catch (error) {
            console.error('Error loading configuration:', error);
        }
    }
}

export interface Configs {
    BaseUrl: string,
    AppUrl: string,
    HostingDomain: string
    UserflowEndpoint: string;
}