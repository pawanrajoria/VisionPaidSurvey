import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ConfigService } from '../../../config.service';

@Injectable({ providedIn: 'root' })
export class SeoLandingService {


  constructor(private title: Title, private meta: Meta, private http: HttpClient, private config: ConfigService) {
  }

  update(data: any) {
    this.title.setTitle(data.title);

    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ name: 'keywords', content: data.keywords?.join(',') });

    if (data.canonical) {
      let link: HTMLLinkElement =
        document.querySelector("link[rel='canonical']") ||
        document.createElement('link');

      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', data.canonical);

      document.head.appendChild(link);
    }
  }

  async getSeoPage(params: any): Promise<any> {
    return await this.http.get<any>(this.config.baseUrl + "seo-page", { params }).toPromise();
  }
}