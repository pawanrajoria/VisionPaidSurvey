import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../../../config.service';

@Injectable({
  providedIn: 'root'
})
export class SeoLandingService {

  private renderer: Renderer2;

  constructor(
    private title: Title,
    private meta: Meta,
    private http: HttpClient,
    private config: ConfigService,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  update(data: any): void {

    if (!data) {
      return;
    }

    // Title
    if (data.title) {
      this.title.setTitle(data.title);
    }

    // Description
    if (data.description) {
      this.meta.updateTag({
        name: 'description',
        content: data.description
      });
    }

    // Keywords
    if (data.keywords?.length) {
      this.meta.updateTag({
        name: 'keywords',
        content: data.keywords.join(',')
      });
    }

    // Canonical
    if (data.canonical) {

      let link = this.document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement | null;

      if (!link) {
        link = this.renderer.createElement('link') as HTMLLinkElement;

        this.renderer.setAttribute(
          link,
          'rel',
          'canonical'
        );

        this.renderer.appendChild(
          this.document.head,
          link
        );
      }

      this.renderer.setAttribute(
        link,
        'href',
        data.canonical
      );
    }
  }

  async getSeoPage(params: any): Promise<any> {
    return await firstValueFrom(
      this.http.get<any>(
        this.config.baseUrl + 'seo-page',
        { params }
      )
    );
  }
}