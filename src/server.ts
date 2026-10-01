import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { SUPPORTED_LOCALES } from './app/country-langiuage-list';
import { BRAND_NAME, SITE_URL } from './app/site.config';

const app = express();
const angularApp = new AngularNodeAppEngine();

const serverModuleDir = import.meta.dirname;
const browserDistFolder = path.resolve(serverModuleDir, '..', 'browser');

// PERF: nothing was compressing responses before this - HTML, JS, CSS, and
// the i18n JSON files were all being sent uncompressed. gzip/brotli
// typically cuts text-based payloads by 70-80%, which directly addresses
// the "Document request latency" and general transfer-time cost on
// throttled mobile connections. Must be registered before any route/static
// handlers so it compresses everything below it.
app.use(compression());

/**
 * SEO: Schema.org Injection
 * This adds structured data to the <head> for better Google rich snippets.
 */
// Brand and domain come from src/environments/environment.ts (via site.config.ts) so
// structured data, canonical URLs and the sitemaps can never disagree about the host.
const SCHEMA_TAG = `\n<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": BRAND_NAME,
      "url": SITE_URL,
      "logo": `${SITE_URL}/assets/images/logo.png`,
      "description": `${BRAND_NAME} is an opinion research platform offering paid surveys, offers and market research studies.`
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "name": BRAND_NAME,
      "url": SITE_URL,
      "publisher": { "@id": `${SITE_URL}/#organization` }
    }
  ]
})}</script>\n`;

function injectSchema(html: string): string {
  return html.replace('</head>', `${SCHEMA_TAG}</head>`);
}

// 1. STATIC ASSETS (Check these first)
app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false,
  redirect: false
}));

// 2. MIXED SITEMAP: CORE DYNAMIC PAGES + STATIC SHARDS INDEX
// /sitemap.xml is a sitemap INDEX: one entry for the core pages below plus one per
// generated content shard. (It used to be a single urlset that listed the shard files
// as if they were pages, which is invalid, and it rebuilt ~170k hreflang links on
// every request - the core-page sitemap is now built once and kept in memory.)
let corePagesSitemap: string | null = null;

app.get('/sitemap.xml', (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  let shards = '';
  try {
    const indexContent = fs.readFileSync(path.join(browserDistFolder, 'sitemaps', 'sitemap-index.xml'), 'utf-8');
    for (const match of indexContent.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)) {
      // Keep only the file name so the shard always lives on the configured host.
      const file = match[1].split('/').pop();
      if (file) shards += `<sitemap><loc>${SITE_URL}/sitemaps/${file}</loc><lastmod>${today}</lastmod></sitemap>`;
    }
  } catch (e) {
    console.warn('Programmatic sitemap shards index not found. Only serving core pages.');
  }

  res.header('Content-Type', 'application/xml');
  res.header('Cache-Control', 'public, max-age=3600');
  res.send(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${SITE_URL}/sitemap-pages.xml</loc><lastmod>${today}</lastmod></sitemap>${shards}</sitemapindex>`);
});

app.get('/sitemap-pages.xml', (_req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Cache-Control', 'public, max-age=3600');

  if (corePagesSitemap) {
    res.send(corePagesSitemap);
    return;
  }

  const hostname = SITE_URL;

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
          ? `${hostname}/${l.urlPrefix}${pathSegment}`
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

  corePagesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${xml}
  </urlset>`;

  res.send(corePagesSitemap);
});

// Expose the folder containing your split XML sitemaps (/sitemaps/sitemap-blog-1.xml, etc.)
app.use('/sitemaps', express.static(path.join(browserDistFolder, 'sitemaps'), {
  maxAge: '0', 
  setHeaders: (res) => {
    res.setHeader('Content-Type', 'application/xml');
  }
}));

// 2b. AI SUPPORT ASSISTANT API
// Proxies chat messages to Anthropic's API server-side, so the API key
// never reaches the browser. Requires ANTHROPIC_API_KEY to be set in the
// server's environment (never commit it to source).
app.post('/api/ai-chat', express.json(), async (req, res) => {
  try {
    const { messages } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    const apiKey = process.env['ANTHROPIC_API_KEY'];
    if (!apiKey) {
      console.error('[ai-chat] ANTHROPIC_API_KEY is not set in the server environment');
      res.status(500).json({ error: 'AI assistant is not configured' });
      return;
    }

    const AI_SYSTEM_PROMPT = `You are the ProfitPiller support assistant, embedded on profitpiller.com.
ProfitPiller is a survey-rewards platform: users earn points/cash by taking paid surveys,
completing offers from an offerwall, playing sponsored games, referring friends, and doing
daily check-ins. Points are redeemed for PayPal cash, Visa/Amazon/other gift cards, or crypto,
subject to a minimum cashout threshold. There's also a leaderboard and a bonus-code redemption
feature.

Answer user questions about how the platform works, earning methods, payouts, cashout timing,
account issues, and general troubleshooting, in a friendly, concise tone (2-4 sentences unless
more detail is truly needed). You do not have access to any specific user's account data
(balance, ticket history, etc.) - if asked for that, explain you can't see account specifics
and offer to raise a support ticket instead.

Call the create_support_ticket tool when: the user explicitly asks for a human/support ticket,
you cannot resolve their issue with general information, or the issue clearly requires account-
specific action (a missing payout, a locked account, a billing dispute, suspected fraud, etc).
Do not call it for general "how does X work" questions you can already answer.`;

    const SUPPORT_TICKET_TOOL = {
      name: 'create_support_ticket',
      description: 'Escalate the user\'s issue to a human support agent by drafting a support ticket.',
      input_schema: {
        type: 'object',
        properties: {
          subject: { type: 'string', description: 'Short (under 80 char) summary of the issue.' },
          description: { type: 'string', description: 'Full details of the issue, including anything already tried in this conversation.' },
          category: { type: 'string', enum: ['account', 'payout', 'survey', 'technical', 'other'] },
        },
        required: ['subject', 'description', 'category'],
      },
    };

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        system: AI_SYSTEM_PROMPT,
        messages,
        tools: [SUPPORT_TICKET_TOOL],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error('[ai-chat] Anthropic API error:', anthropicResponse.status, errText);
      res.status(502).json({ error: 'The assistant is temporarily unavailable. Please try again shortly.' });
      return;
    }

    const data: any = await anthropicResponse.json();
    let reply = '';
    let ticketDraft: { subject: string; description: string; category: string } | null = null;

    for (const block of data.content ?? []) {
      if (block.type === 'text') reply += block.text;
      if (block.type === 'tool_use' && block.name === 'create_support_ticket') {
        ticketDraft = {
          subject: block.input?.subject ?? '',
          description: block.input?.description ?? '',
          category: block.input?.category ?? 'other',
        };
      }
    }

    if (!reply && ticketDraft) {
      reply = "I've drafted a support ticket for this - take a look below and submit it whenever you're ready.";
    }

    res.json({ reply, ticketDraft });
  } catch (err) {
    console.error('[ai-chat] proxy error:', err);
    res.status(500).json({ error: 'Something went wrong talking to the assistant.' });
  }
});

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