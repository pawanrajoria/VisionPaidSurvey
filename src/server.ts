import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import path from 'node:path';

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
      "https://www.facebook.com/profitpiller", // Replace with your actual links
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

// 2. DYNAMIC SITEMAP
app.get('/sitemap.xml', (_req, res) => {
  const hostname = 'https://www.profitpiller.com';
  // Include all major routes for indexing
  const routes = ['', 'aboutus', 'contactus', 'privacy-policy', 'terms-conditions', 'auth/login', 'app/survey']; 
  const urls = routes.map(r => `<url><loc>${hostname}/${r}</loc><changefreq>weekly</changefreq></url>`).join('');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;
  
  res.header('Content-Type', 'application/xml');
  res.send(sitemap.trim());
});

// 3. SSR RENDERING WITH SCHEMA INJECTION
app.use(async (req, res, next) => {
  angularApp
    .handle(req)
    .then(async (response) => {
      if (response) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
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