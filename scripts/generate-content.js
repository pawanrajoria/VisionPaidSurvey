#!/usr/bin/env node
/**
 * ProfitPiller programmatic content generator
 * -------------------------------------------
 * Produces the static "sharded JSON" data layer that BlogService /
 * GiftCardService read from, plus paginated index files and a
 * search-engine sitemap. This is what lets the Angular app serve
 * 1,00,000+ blog/guide pages and 10,000+ gift card pages without
 * hand-writing a single one.
 *
 * USAGE
 *   node scripts/generate-content.js --blogCount 100000 --giftCardCount 10000
 *
 * OUTPUT
 *   src/assets/data/blog/<slug>.json                 (one per post)
 *   src/assets/data/blog/index/<category>-page-N.json
 *   src/assets/data/gift-cards/<slug>.json
 *   src/assets/data/gift-cards/index/<category>-page-N.json
 *   src/assets/data/gift-cards/index/categories.json
 *   src/sitemaps/sitemap-blog-N.xml
 *   src/sitemaps/sitemap-gift-cards-N.xml
 *   src/sitemaps/sitemap-index.xml
 *
 * IMPORTANT — READ THIS BEFORE YOU CHASE 100K INDEXED PAGES
 * Google/Bing will not meaningfully index 100,000 near-duplicate
 * template pages just because they exist. To actually rank you need:
 *   1. Genuinely differentiated content per page (this script gives
 *      you a *structural* skeleton — swap the Lorem-style filler
 *      functions below for real per-brand/per-topic facts, screenshots,
 *      current payout rates, etc. Thin/duplicate pages get filtered
 *      out of the index or hit with a Helpful Content-style demotion).
 *   2. Server-side rendering or prerendering (Angular SSR/Universal or
 *      a prerender step) — pure client-side-rendered Angular pages are
 *      slow and unreliable to get crawled at this volume.
 *   3. Internal linking (category pages, related-content blocks — both
 *      already wired into the components) so crawlers can discover
 *      every URL without relying on the sitemap alone.
 *   4. A real sitemap index, split at the 50,000-URL / 50MB spec limit
 *      (handled below) and submitted in Search Console / Bing Webmaster.
 *   5. Crawl-budget pacing — publish in batches, not all 1,00,000 at
 *      once, so the pages get crawled and evaluated in equal-quality
 *      cohorts instead of triggering spam heuristics.
 */

const fs = require('fs');
const path = require('path');

// ---------- CLI args ----------
const args = Object.fromEntries(
  process.argv.slice(2).map(a => a.replace(/^--/, '').split('='))
);
const BLOG_COUNT = parseInt(args.blogCount || '1000', 10);       // set to 100000 for full run
const GIFTCARD_COUNT = parseInt(args.giftCardCount || '500', 10); // set to 10000 for full run
const PAGE_SIZE = 24;
const SITE_URL = 'https://profitpiller.com';
const OUT_ROOT = path.join(__dirname, '..', 'src', 'assets', 'data');
const SITEMAP_ROOT = path.join(__dirname, '..', 'src', 'sitemaps');

// ---------- Source data for combinatorial generation ----------
const BLOG_CATEGORIES = ['earn', 'save', 'rewards', 'passive-income', 'gaming', 'guides'];
const TOPIC_SUBJECTS = [
  'Receipt Scanning Apps', 'Survey Panels', 'Cashback Browser Extensions', 'PC Game Offers',
  'Mobile Game Offers', 'Crypto Faucets', 'Watch-to-Earn Apps', 'Referral Programs',
  'Daily Check-In Rewards', 'Offerwalls', 'Sign-Up Bonuses', 'Loyalty Point Stacking',
  'Gift Card Flipping', 'Micro-Task Platforms', 'App Testing Gigs', 'Search-to-Earn Tools',
];
const GAME_NAMES = [
  'Genshin Impact', 'Raid Shadow Legends', 'Coin Master', 'Clash of Clans', 'Homescapes',
  'State of Survival', 'Rise of Kingdoms', 'Merge Mansion', 'Royal Match', 'Township',
  'Hero Wars', 'Lords Mobile', 'Toon Blast', 'Gardenscapes', 'Empires & Puzzles',
];
const ANGLES = [
  'Complete Guide', 'Fastest Way', 'Step-by-Step Walkthrough', 'Tips & Tricks',
  '{year} Update', 'Beginner\u2019s Guide', 'Common Mistakes to Avoid', 'Pro Strategy',
];

const GIFTCARD_BRANDS = [
  { brand: 'Amazon', category: 'shopping' }, { brand: 'Steam', category: 'gaming' },
  { brand: 'PlayStation', category: 'gaming' }, { brand: 'Xbox', category: 'gaming' },
  { brand: 'Google Play', category: 'shopping' }, { brand: 'Apple', category: 'shopping' },
  { brand: 'Netflix', category: 'streaming' }, { brand: 'Spotify', category: 'streaming' },
  { brand: 'DoorDash', category: 'food-delivery' }, { brand: 'Uber Eats', category: 'food-delivery' },
  { brand: 'Bitcoin', category: 'crypto' }, { brand: 'Ethereum', category: 'crypto' },
  { brand: 'Litecoin', category: 'crypto' }, { brand: 'Visa Prepaid', category: 'prepaid-visa' },
  { brand: 'Mastercard Prepaid', category: 'prepaid-visa' }, { brand: 'Airbnb', category: 'travel' },
  { brand: 'Delta Air Lines', category: 'travel' }, { brand: 'Walmart', category: 'shopping' },
  { brand: 'Target', category: 'shopping' }, { brand: 'Roblox', category: 'gaming' },
];
const DENOM_SETS = [5, 10, 15, 20, 25, 50, 100, 200];

// ---------- helpers ----------
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function pad(n, len) { return String(n).padStart(len, '0'); }
function pick(arr, i) { return arr[i % arr.length]; }
function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data));
}
function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

// ---------- blog post factory ----------
function buildBlogPost(index) {
  const category = pick(BLOG_CATEGORIES, index);
  const isGame = category === 'gaming' || category === 'guides';
  const subject = isGame ? pick(GAME_NAMES, index) : pick(TOPIC_SUBJECTS, index);
  const angle = pick(ANGLES, Math.floor(index / TOPIC_SUBJECTS.length)).replace('{year}', '2026');
  const title = `${subject}: ${angle} to Maximize Your Earnings`;
  const slug = `${slugify(subject)}-${slugify(angle)}-${pad(index, 6)}`;
  const earningsLow = 5 + (index % 20) * 5;
  const earningsHigh = earningsLow + 10 + (index % 5) * 10;

  return {
    id: `post-${index}`,
    slug,
    title,
    metaTitle: `${title} | ProfitPiller`,
    metaDescription: `Earn $${earningsLow}\u2013$${earningsHigh} with our ${subject} guide. Step-by-step instructions, screenshots, and payout-maximizing tips updated for 2026.`,
    excerpt: `A complete, up-to-date walkthrough for ${subject.toLowerCase()} \u2014 what it pays, how long it takes, and the fastest legitimate path to your reward.`,
    category,
    tags: [slugify(subject), category, '2026'],
    coverImage: `https://picsum.photos/seed/${slug}/800/450`,
    author: { name: pick(['Ava Chen', 'Marcus Ade', 'Priya Nair', 'Leo Fischer'], index), avatar: `https://i.pravatar.cc/64?u=${index % 40}` },
    publishedAt: isoDaysAgo(300 - (index % 300)),
    updatedAt: isoDaysAgo(index % 30),
    readMinutes: 4 + (index % 8),
    estimatedEarnings: `$${earningsLow}\u2013$${earningsHigh}`,
    content: [
      { type: 'heading', heading: `What Is ${subject}?` },
      { type: 'paragraph', text: `${subject} is one of the highest-converting ways to earn on ProfitPiller right now. This guide breaks down exactly how it works, what you need before you start, and how to avoid the mistakes that slow most users down.` },
      { type: 'heading', heading: 'Before You Start' },
      { type: 'list', items: ['A verified ProfitPiller account', '10\u201315 minutes of uninterrupted time', 'A stable internet connection', 'Optional: a referral link to stack bonus points'] },
      { type: 'tip', text: `Completing ${subject.toLowerCase()} during weekly bonus windows can boost your payout by up to 25%.` },
      { type: 'heading', heading: 'Step-by-Step Walkthrough' },
      { type: 'list', items: [`Open the ${subject} offer from your dashboard`, 'Follow the in-offer instructions exactly as shown', 'Reach the qualifying milestone to trigger the payout', 'Confirm crediting in your wallet within 24\u201348 hours'] },
      { type: 'warning', text: 'Using VPNs, multiple accounts, or bots on this offer will void your payout and may suspend your account.' },
      { type: 'heading', heading: 'Maximizing Your Payout' },
      { type: 'paragraph', text: `Pair ${subject.toLowerCase()} with a related offer in the same category to compound your earnings without additional time investment.` },
      { type: 'table', tableHeaders: ['Milestone', 'Reward'], tableRows: [['Start', '$0'], ['50% Complete', `$${Math.round(earningsLow / 2)}`], ['Full Completion', `$${earningsHigh}`]] },
      { type: 'faq', faqs: [
        { question: `How long does ${subject} take to pay out?`, answer: 'Most users see credit within 24\u201348 hours of completing the final milestone.' },
        { question: 'Is this offer available worldwide?', answer: 'Availability varies by region \u2014 check the offer card in your dashboard for your country\u2019s eligibility.' },
      ] },
    ],
    relatedSlugs: [],
    canonicalUrl: `/blog/${slug}`,
  };
}

// ---------- gift card factory ----------
function buildGiftCard(index) {
  const { brand, category } = pick(GIFTCARD_BRANDS, index);
  const variant = index >= GIFTCARD_BRANDS.length ? ` ${Math.floor(index / GIFTCARD_BRANDS.length) + 1}` : '';
  const title = `${brand} Gift Card${variant}`;
  const slug = `${slugify(brand)}-gift-card${variant ? '-' + slugify(variant) : ''}-${pad(index, 6)}`;
  const denominations = DENOM_SETS.filter((_, i) => (index + i) % 2 === 0).map(amount => ({
    amount, currency: 'USD', pointsRequired: amount * 100, inStock: (index + amount) % 7 !== 0,
  }));

  return {
    id: `gc-${index}`,
    slug,
    brand,
    title,
    metaTitle: `${title} \u2014 Redeem With Points | ProfitPiller`,
    metaDescription: `Redeem your ProfitPiller wallet points for a ${brand} gift card. Instant delivery, verified codes, transparent point pricing.`,
    category,
    logoUrl: `https://picsum.photos/seed/${slugify(brand)}-logo/120/120`,
    heroImage: `https://picsum.photos/seed/${slug}/900/600`,
    shortDescription: `Redeem your points instantly for a ${brand} gift card \u2014 verified codes, no waiting.`,
    longDescription: `${brand} is one of the most requested redemption options on ProfitPiller. Codes are sourced from verified distributors and delivered directly to your account wallet, ready to use within minutes of redemption.`,
    denominations: denominations.length ? denominations : [{ amount: 10, currency: 'USD', pointsRequired: 1000, inStock: true }],
    howToRedeem: [
      'Confirm you have enough wallet points for your chosen denomination',
      `Select your ${brand} gift card amount and click Redeem`,
      'Check your email and ProfitPiller inbox for the code',
      `Apply the code at ${brand}\u2019s official redemption page`,
    ],
    termsAndConditions: [
      'Codes are single-use and non-refundable once revealed',
      'Redemption may take up to 24 hours during high-demand periods',
      'Regional restrictions may apply \u2014 check availability before redeeming',
    ],
    countriesAvailable: ['US', 'CA', 'UK', 'AU', 'IN', 'DE', 'FR'],
    rating: (3.8 + (index % 12) / 10).toFixed(1) * 1,
    reviewCount: 50 + (index % 900),
    popularityRank: index,
    faqs: [
      { question: `Is the ${brand} gift card code guaranteed to work?`, answer: 'Yes \u2014 every code is verified before it is added to inventory. If a code ever fails, our support team replaces it immediately.' },
      { question: 'How fast is delivery?', answer: 'Most codes are delivered instantly; during peak demand, delivery can take up to 24 hours.' },
    ],
    relatedSlugs: [],
    updatedAt: isoDaysAgo(index % 20),
  };
}

// ---------- generation + pagination ----------
function generateSet(count, factory, outDir, categories) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const item = factory(i);
    items.push(item);
    writeJson(path.join(outDir, `${item.slug}.json`), item);
  }
  buildIndexes(items, outDir, categories);
  return items;
}

function buildIndexes(items, outDir, categories) {
  const byCategory = { all: items };
  for (const cat of categories) byCategory[cat] = items.filter(i => i.category === cat);

  for (const [cat, list] of Object.entries(byCategory)) {
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    for (let page = 1; page <= totalPages; page++) {
      const start = (page - 1) * PAGE_SIZE;
      const pageItems = list.slice(start, start + PAGE_SIZE).map(toSummary);
      writeJson(path.join(outDir, 'index', `${cat}-page-${page}.json`), {
        items: pageItems, page, pageSize: PAGE_SIZE, totalItems: list.length, totalPages,
      });
    }
  }
}

function toSummary(item) {
  const { content, relatedSlugs, longDescription, howToRedeem, termsAndConditions, faqs, ...rest } = item;
  return rest;
}

// ---------- sitemap ----------
function writeSitemaps(items, urlPrefix, filePrefix) {
  ensureDir(SITEMAP_ROOT);
  const CHUNK = 45000; // safely under the 50,000-URL sitemap spec limit
  const files = [];
  for (let i = 0; i * CHUNK < items.length; i++) {
    const chunk = items.slice(i * CHUNK, (i + 1) * CHUNK);
    const urls = chunk.map(item =>
      `<url><loc>${SITE_URL}${urlPrefix}/${item.slug}</loc><lastmod>${(item.updatedAt || '').slice(0, 10)}</lastmod></url>`
    ).join('');
    const filename = `${filePrefix}-${i + 1}.xml`;
    fs.writeFileSync(
      path.join(SITEMAP_ROOT, filename),
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
    );
    files.push(filename);
  }
  return files;
}

function writeSitemapIndex(files) {
  const entries = files.map(f => `<sitemap><loc>${SITE_URL}/sitemaps/${f}</loc></sitemap>`).join('');
  fs.writeFileSync(
    path.join(SITEMAP_ROOT, 'sitemap-index.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`
  );
}

// ---------- run ----------
function main() {
  console.log(`Generating ${BLOG_COUNT} blog/guide posts and ${GIFTCARD_COUNT} gift cards...`);

  const blogPosts = generateSet(BLOG_COUNT, buildBlogPost, path.join(OUT_ROOT, 'blog'), BLOG_CATEGORIES);
  const giftCards = generateSet(GIFTCARD_COUNT, buildGiftCard, path.join(OUT_ROOT, 'gift-cards'),
    [...new Set(GIFTCARD_BRANDS.map(b => b.category))]);

  writeJson(path.join(OUT_ROOT, 'gift-cards', 'index', 'categories.json'),
    [...new Set(giftCards.map(g => g.category))].map(category => ({
      category, label: category.replace(/-/g, ' '),
      count: giftCards.filter(g => g.category === category).length,
    }))
  );

  const blogSitemapFiles = writeSitemaps(blogPosts, '/blog', 'sitemap-blog');
  const giftCardSitemapFiles = writeSitemaps(giftCards, '/gift-cards', 'sitemap-gift-cards');
  writeSitemapIndex([...blogSitemapFiles, ...giftCardSitemapFiles]);

  console.log(`Done.
  Blog posts:  ${blogPosts.length} JSON shards -> ${path.join(OUT_ROOT, 'blog')}
  Gift cards:  ${giftCards.length} JSON shards -> ${path.join(OUT_ROOT, 'gift-cards')}
  Sitemaps:    ${SITEMAP_ROOT}/sitemap-index.xml`);
}

main();
