import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { SUPPORTED_LOCALES } from './app/country-langiuage-list';

const app = express();
const angularApp = new AngularNodeAppEngine();

const serverModuleDir = import.meta.dirname;
const browserDistFolder = path.resolve(serverModuleDir, '..', 'browser');

/**
 * SEO: Schema.org Injection
 * This adds structured data to the <head> for better Google rich snippets.
 */
function injectSchema(html: string): string {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Profitpiller",
    "alternateName": "Profit Piller",
    "url": "https://www.profitpiller.com",
    "logo": "https://www.profitpiller.com/assets/images/logo.png",
    "description": "Profitpiller is a leading opinion research platform offering paid surveys and market research studies.",
    "sameAs": [
      "https://www.facebook.com/profitpiller",
      "https://twitter.com/profitpiller"
    ]
  };

  const scriptTag = `\n<script type="application/ld+json">${JSON.stringify(schemaData)}</script>\n`;
  return html.replace('</head>', `${scriptTag}</head>`);
}

// 1. STATIC ASSETS (Check these first)
app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false,
  redirect: false
}));

// 2. MIXED SITEMAP: CORE DYNAMIC PAGES + STATIC SHARDS INDEX
app.get('/sitemap.xml', (_req, res) => {
  const hostname = 'https://www.profitpiller.com';

  // Core pages to be translated dynamically on the fly
  const routes = [
    '',
    'aboutus',
    'contactus',
    'privacy-policy',
    'terms-conditions',
    'amazongiftcard',
    'paypal',
    'giftcard',
    'visa',
    'cashout',
    'help',
    'cookie-policy'
  ];

  let xml = '';

  // 1. Generate the multi-language blocks for your main static-ish pages
  for (const route of routes) {
    for (const locale of SUPPORTED_LOCALES.filter(x => x.hreflang !== 'x-default')) {
      const pathSegment = route ? `/${route}` : '';
      const url = `${hostname}/${locale.urlPrefix}${pathSegment}`;

      const hreflangs = SUPPORTED_LOCALES.map(l => {
        const href = l.hreflang === 'x-default'
          ? `${hostname}${pathSegment}`
          : `${hostname}/${l.urlPrefix}${pathSegment}`;

        return `<xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${href}" />`;
      }).join('');

      xml += `
      <url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${route === '' ? '1.0' : '0.8'}</priority>
        ${hreflangs}
      </url>`;
    }
  }

  // 2. Read the programmatic sitemap index from file and parse its links right into here
  let programmaticSitemapsXml = '';
  try {
    const sitemapIndexPath = path.join(browserDistFolder, 'sitemaps', 'sitemap-index.xml');
    const indexContent = fs.readFileSync(sitemapIndexPath, 'utf-8');
    
    // Extract everything between <sitemap> and </sitemap> tags
    const sitemapMatches = indexContent.match(/<sitemap>[\s\S]*?<\/sitemap>/g);
    if (sitemapMatches) {
      // Convert <sitemap><loc>...</loc></sitemap> structures into flat <url> pointers
      programmaticSitemapsXml = sitemapMatches
        .map(s => s.replace('<sitemap>', '<url>').replace('</sitemap>', '</url>'))
        .join('');
    }
  } catch (e) {
    // Fail silently if content generator hasn't run yet so it doesn't crash the whole main file
    console.warn('Programmatic sitemap shards index not found. Only serving core pages.');
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${xml}
      ${programmaticSitemapsXml}
  </urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// Expose the folder containing your split XML sitemaps (/sitemaps/sitemap-blog-1.xml, etc.)
app.use('/sitemaps', express.static(path.join(browserDistFolder, 'sitemaps'), {
  maxAge: '0', 
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/xml');
  }
}));

// 3. SSR RENDERING WITH SCHEMA INJECTION
app.use(async (req, res, next) => {
  angularApp
    .handle(req)
    .then(async (response) => {
      if (response) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
          
          // CDN Cache public pages for 1 hour; do not cache private app routes
          if (!req.url.includes('/app') && !req.url.includes('/admin')) {
            res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=3600');
          }

          const html = await response.text();
          const updatedHtml = injectSchema(html);
          res.status(response.status).send(updatedHtml);
        } else {
          await writeResponseToNodeResponse(response, res);
        }
      } else {
        next();
      }
    })
    .catch(next);
});

export { app };