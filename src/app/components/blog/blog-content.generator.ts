import { BlogCategory, BlogContentBlock, BlogPost, BlogPostSummary } from './blog-post.model';
import { decompose, combinationSpace, seededRandom, randInt, pick, slugWithIndex, parseIndexFromSlug } from './content-engine.core';

// ---- Word banks -----------------------------------------------------
// Each combination of (action, outcome, method, context, category) is a
// distinct page. Sizes below multiply out to 100k+ unique combinations
// (see BLOG_SPACE at the bottom) while keeping every generated title
// readable English rather than keyword-stuffed nonsense.

const ACTIONS = [
  'Earn', 'Make', 'Save', 'Stack Up', 'Rack Up', 'Pocket', 'Collect',
  'Turn Free Time Into', 'Grow', 'Build', 'Bank', 'Cash In On',
] as const;

const OUTCOMES = [
  'Extra Cash', 'Free Gift Cards', 'Real Money', 'PayPal Cash', 'Passive Income',
  'a Side Income', 'Bonus Rewards', 'Weekly Payouts', 'Amazon Credit', 'Fast Rewards',
  'Points You Can Redeem', 'Money for Bills',
] as const;

const METHODS = [
  'Taking Online Surveys', 'Completing Simple Offers', 'Playing Mobile Games',
  'Watching Short Videos', 'Testing New Apps', 'Referring Friends',
  'Doing Daily Check-Ins', 'Reviewing Products', 'Signing Up for Free Trials',
  'Sharing Your Opinion', 'Trying New Services', 'Answering Quick Polls',
  'Downloading Sponsored Apps', 'Completing Micro-Tasks', 'Filling Out Questionnaires',
] as const;

const CONTEXTS = [
  'From Your Phone', 'In Your Spare Time', 'Without Any Experience',
  'As a Student', 'On Weekends', 'During Your Commute', 'While You Watch TV',
  'From Home', 'In Under 10 Minutes a Day', 'Without Spending Any Money',
] as const;

const CATEGORIES: BlogCategory[] = ['earn', 'save', 'rewards', 'passive-income', 'gaming', 'guides'];

const BANK_LENGTHS = [ACTIONS.length, OUTCOMES.length, METHODS.length, CONTEXTS.length, CATEGORIES.length];
export const BLOG_SPACE = combinationSpace(BANK_LENGTHS); // 12*12*15*10*6 = 129,600

const TIPS = [
  'Set aside a fixed 15-minute window each day so it becomes a habit rather than an afterthought.',
  'Complete your profile fully - platforms match higher-paying opportunities to complete profiles first.',
  'Cash out consistently rather than letting a large balance sit unredeemed.',
  'Stack multiple small methods together rather than relying on just one.',
  'Check back daily - new opportunities are typically added throughout the day.',
] as const;

const WARNINGS = [
  "Never pay money upfront to access a legitimate rewards opportunity - that's a red flag.",
  'Read the terms on any offer before starting it, especially around qualification requirements.',
  'Keep your login details private; no legitimate platform will ask for your password by email.',
] as const;

const FAQ_BANK: { question: string; answer: string }[] = [
  { question: 'How much can I realistically earn?', answer: 'It depends on the time you put in and which methods you combine, but consistent daily activity adds up meaningfully over a month.' },
  { question: 'Is this available on mobile?', answer: 'Yes - most of these methods work fully from a phone browser or a dedicated app.' },
  { question: 'How fast do payouts arrive?', answer: 'Most platforms process cashouts within a few days once you hit the minimum threshold.' },
  { question: 'Do I need any special skills?', answer: 'No - these methods are designed for anyone to start immediately with no prior experience.' },
  { question: 'Is my personal information safe?', answer: 'Stick to platforms with a clear privacy policy and avoid ones asking for sensitive financial details upfront.' },
];

const COVER_IMAGES = [
  '/assets/images/backgrounds/reward-bg.jpg',
  '/assets/images/backgrounds/reward-bg-2.jpg',
  '/assets/images/backgrounds/gift-2.png',
  '/assets/images/icon/gift-card1.jpg',
] as const;

const AUTHOR = { name: 'ProfitPiller Editorial Team', avatar: '/assets/images/logo_23.png' };

// ---- Generator --------------------------------------------------------

function buildFromParts(index: number, actionI: number, outcomeI: number, methodI: number, contextI: number, categoryI: number): BlogPost {
  const action = ACTIONS[actionI];
  const outcome = OUTCOMES[outcomeI];
  const method = METHODS[methodI];
  const context = CONTEXTS[contextI];
  const category = CATEGORIES[categoryI];

  const title = `${action} ${outcome} by ${method} ${context}`;
  const slug = slugWithIndex(title, index);
  const rng = seededRandom(index + 1); // +1 so index 0 isn't an all-zero seed

  const minEarn = randInt(rng, 5, 40);
  const maxEarn = minEarn + randInt(rng, 15, 60);

  const readMinutes = randInt(rng, 4, 9);
  const dayOffset = randInt(rng, 0, 720); // spread "publish dates" over ~2 years
  const published = new Date(Date.now() - dayOffset * 86400000).toISOString();
  const updated = new Date(Date.now() - Math.floor(dayOffset / 3) * 86400000).toISOString();

  const content: BlogContentBlock[] = [
    { type: 'paragraph', text: `If you're looking to ${action.toLowerCase()} ${outcome.toLowerCase()}, ${method.toLowerCase()} is one of the most accessible ways to get started ${context.toLowerCase()} - no special equipment or experience required.` },
    { type: 'heading', heading: 'Why This Works' },
    { type: 'paragraph', text: `${method} pays out because brands and researchers are willing to compensate real people for their time and honest feedback. The more consistently you show up, the more opportunities get matched to your profile.` },
    { type: 'tip', text: pick(rng, TIPS) },
    { type: 'heading', heading: 'Getting Started' },
    { type: 'list', items: [
      'Create a free account and complete your profile',
      `Start with ${method.toLowerCase()} to build momentum`,
      'Check back daily for new opportunities',
      'Redeem your balance once you hit the minimum cashout',
    ] },
    { type: 'heading', heading: 'How Much You Can Expect' },
    { type: 'paragraph', text: `Most people earn somewhere between $${minEarn} and $${maxEarn} a month with consistent activity, though this varies by location and how much time you put in.` },
    { type: 'warning', text: pick(rng, WARNINGS) },
    { type: 'faq', faqs: [pick(rng, FAQ_BANK), pick(rng, FAQ_BANK)] },
  ];

  return {
    id: `blog-${index}`,
    slug,
    title,
    metaTitle: `${title} | ProfitPiller`,
    metaDescription: `Learn how to ${action.toLowerCase()} ${outcome.toLowerCase()} by ${method.toLowerCase()} ${context.toLowerCase()}. Step-by-step guidance and real earning expectations.`,
    excerpt: `A practical look at how to ${action.toLowerCase()} ${outcome.toLowerCase()} by ${method.toLowerCase()} ${context.toLowerCase()}.`,
    category,
    tags: [category, method.split(' ')[0].toLowerCase(), 'earning-guide'],
    coverImage: pick(rng, COVER_IMAGES),
    author: AUTHOR,
    publishedAt: published,
    updatedAt: updated,
    readMinutes,
    estimatedEarnings: `$${minEarn}–$${maxEarn}`,
    content,
    relatedSlugs: relatedIndexes(index, 3).map(i => indexToTitleSlug(i)),
  };
}

function indexToTitleSlug(index: number): string {
  const [a, o, m, c, cat] = decompose(index, BANK_LENGTHS);
  const title = `${ACTIONS[a]} ${OUTCOMES[o]} by ${METHODS[m]} ${CONTEXTS[c]}`;
  return slugWithIndex(title, index);
}

/** Deterministic set of "related" indexes near this one, without repeating it. */
function relatedIndexes(index: number, count: number): number[] {
  const rng = seededRandom(index + 777);
  const out = new Set<number>();
  while (out.size < count) {
    const candidate = randInt(rng, 0, BLOG_SPACE - 1);
    if (candidate !== index) out.add(candidate);
  }
  return Array.from(out);
}

export function generateBlogPost(index: number): BlogPost {
  const safeIndex = ((index % BLOG_SPACE) + BLOG_SPACE) % BLOG_SPACE;
  const [a, o, m, c, cat] = decompose(safeIndex, BANK_LENGTHS);
  return buildFromParts(safeIndex, a, o, m, c, cat);
}

export function generateBlogSummary(index: number): BlogPostSummary {
  const { content, relatedSlugs, ...summary } = generateBlogPost(index);
  return summary;
}

/** Resolves a URL slug back to its post by re-deriving the index and regenerating - no lookup table needed. */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const index = parseIndexFromSlug(slug);
  if (index === null || index < 0 || index >= BLOG_SPACE) return null;
  return generateBlogPost(index);
}

/** Page of summaries, optionally filtered to one category, for the list view. */
export function listBlogSummaries(opts: { page: number; pageSize: number; category?: BlogCategory }): {
  items: BlogPostSummary[]; totalItems: number; totalPages: number;
} {
  const categoryIndex = opts.category ? CATEGORIES.indexOf(opts.category) : null;

  if (categoryIndex === null) {
    const totalItems = BLOG_SPACE;
    const start = (opts.page - 1) * opts.pageSize;
    const items = Array.from({ length: opts.pageSize }, (_, i) => start + i)
      .filter(i => i < totalItems)
      .map(generateBlogSummary);
    return { items, totalItems, totalPages: Math.ceil(totalItems / opts.pageSize) };
  }

  // Filtering to one category: category is the outermost (slowest-changing) digit,
  // so every index of the form (categoryIndex * base + i) for i in [0, base) belongs to it,
  // where base = product of every other bank's length.
  const base = BANK_LENGTHS.slice(0, 4).reduce((a, b) => a * b, 1); // product of all but category
  const totalItems = base;
  const start = (opts.page - 1) * opts.pageSize;
  const items = Array.from({ length: opts.pageSize }, (_, i) => start + i)
    .filter(i => i < totalItems)
    .map(i => generateBlogSummary(categoryIndex * base + i));
  return { items, totalItems, totalPages: Math.ceil(totalItems / opts.pageSize) };
}

/** Lightweight deterministic "search": scans a bounded window and keyword-matches titles. */
export function searchBlogSummaries(query: string, limit = 24): BlogPostSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: BlogPostSummary[] = [];
  const scanLimit = Math.min(BLOG_SPACE, 5000);
  for (let i = 0; i < scanLimit && results.length < limit; i++) {
    const summary = generateBlogSummary(i);
    if (summary.title.toLowerCase().includes(q) || summary.category.includes(q)) {
      results.push(summary);
    }
  }
  return results;
}
