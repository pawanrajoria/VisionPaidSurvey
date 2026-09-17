import {
  AngularNodeAppEngine,
  writeResponseToNodeResponse
} from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { SUPPORTED_LOCALES } from './app/country-langiuage-list';

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