import { BlogCategory, BlogContentBlock, BlogPost, BlogPostSummary } from './blog-post.model';
import { decompose, combinationSpace, seededRandom, randInt, pick, slugWithIndex, parseIndexFromSlug } from './content-engine.core';

// ---- Word banks -----------------------------------------------------
// Each combination of (action, outcome, method, context, category) is a
// distinct page about earning on Profitpiller. The bank *lengths* are kept
// stable (12 x 12 x 15 x 10 x 6 = 129,600) so every index that has ever been
// addressable still resolves to a page.
//
// Copy rules: describe how Profitpiller actually works (surveys, offers, offer
// walls, streak badges, levels, referrals, $5 minimum cash-out, PayPal / UPI /
// gift cards, the Android app) and never promise a fixed income - earnings
// depend on survey availability, location, profile match and time spent.

const ACTIONS = [
  'Earn', 'Collect', 'Stack Up', 'Rack Up', 'Work Toward', 'Build Up',
  'Grow', 'Unlock', 'Get Closer to', 'Steadily Earn', 'Score', 'Pick Up',
] as const;

const OUTCOMES = [
  'Profitpiller Points', 'PayPal Cash on Profitpiller', 'UPI Payouts on Profitpiller',
  'Amazon Gift Cards on Profitpiller', 'Visa Gift Cards on Profitpiller', 'Google Play Credit on Profitpiller',
  'Your First $5 Cash-Out', 'Bonus Points on Profitpiller', 'Level-Up Rewards on Profitpiller',
  'Extra Survey Points', 'Gift Card Rewards on Profitpiller', 'Referral Points on Profitpiller',
] as const;

const METHODS = [
  'Taking Paid Surveys', 'Completing Sponsored Offers', 'Exploring Offer Walls',
  'Keeping Your Daily Streak', 'Inviting Friends', 'Completing Your Profile',
  'Answering Surveys Honestly', 'Using the Android App', 'Checking for New Surveys Daily',
  'Climbing Through Levels', 'Trying App and Game Offers', 'Finishing Short Surveys',
  'Following Offer Instructions Carefully', 'Redeeming Bonus Codes', 'Watching the Leaderboard',
] as const;

const CONTEXTS = [
  'From Your Phone', 'In Your Spare Time', 'As a Beginner', 'As a Student', 'On Weekends',
  'During Your Commute', 'in 15 Minutes a Day', 'From Home', 'Without Spending Money', 'Step by Step',
] as const;

const CATEGORIES: BlogCategory[] = ['earn', 'save', 'rewards', 'passive-income', 'gaming', 'guides'];

const BANK_LENGTHS = [ACTIONS.length, OUTCOMES.length, METHODS.length, CONTEXTS.length, CATEGORIES.length];
export const BLOG_SPACE = combinationSpace(BANK_LENGTHS); // 12*12*15*10*6 = 129,600

/** Per-method explanation + steps, so each method reads as its own article. */
const METHOD_DETAILS: { why: string; steps: string[]; tag: string }[] = [
  { tag: 'surveys',
    why: 'Paid surveys are the core of Profitpiller. Market-research partners pay for real opinions, and each survey shows its point reward and estimated length before you start. You are first asked a few qualifying questions; if your profile matches the audience the researcher needs, you continue and earn the points once the survey is completed and approved.',
    steps: ['Open the Surveys section and look at the points and minutes shown on each card', 'Start with surveys that match your profile and interests', 'Answer the qualifying questions accurately - screen-outs are normal and not your fault', 'Finish the full survey to have the points credited to your balance'] },
  { tag: 'offers',
    why: 'Sponsored offers pay points for a specific action - installing and using an app, reaching a level in a game, or signing up for a free trial. Each offer lists exactly what you have to do, and the advertiser confirms completion before the points are released, which can take anywhere from minutes to several days depending on the offer.',
    steps: ['Read the offer requirements before you tap Start', 'Complete the action on the same device and without ad blockers or VPNs', 'Keep the app installed until the reward is confirmed', 'Contact support with details if an offer does not track after the stated time'] },
  { tag: 'offer-walls',
    why: 'Offer walls are partner catalogues inside Profitpiller that bundle hundreds of surveys, app tasks and game milestones in one place. Because each wall has its own inventory, checking more than one gives you more choices on any given day - points from every wall land in the same Profitpiller balance.',
    steps: ['Open the Offer Walls tab and browse a couple of different walls', 'Filter for tasks you can realistically finish', 'Note the reward and any time limit before starting', 'Check your activity history to confirm each completed task was credited'] },
  { tag: 'streak',
    why: 'Your daily streak counts consecutive days on which you complete at least one survey. Streaks unlock badges and streak milestones rather than cash, but they are a simple way to build a routine - and a routine is what keeps your points balance moving toward the $5 cash-out.',
    steps: ['Complete at least one survey each day to keep the streak alive', 'Check the streak progress panel to see your next milestone', 'Collect the badges you unlock along the way', 'Use a daily reminder so a busy day does not break the run'] },
  { tag: 'referrals',
    why: 'The referral program lets you invite friends with your personal link. When the people you invite join and stay active, you can earn referral points on top of your own activity. It works best when you invite people who are genuinely interested in surveys rather than spamming links.',
    steps: ['Copy your personal invite link from the Refer section', 'Share it with friends or family who would enjoy surveys', 'Explain how points and the $5 minimum cash-out work so they know what to expect', 'Track referral activity from your account'] },
  { tag: 'profile',
    why: 'Survey partners use your profile answers to decide which surveys to show you. A complete, accurate profile means fewer screen-outs and better-matched surveys, so finishing your profile questions is one of the highest-value things you can do in your first week on Profitpiller.',
    steps: ['Open your account and complete every profile section', 'Answer truthfully - mismatched answers lead to rejections later', 'Update your profile when your situation changes (job, household, devices)', 'Revisit profile questions occasionally as new ones are added'] },
  { tag: 'honest-answers',
    why: 'Researchers check survey quality with attention questions, consistency checks and speed checks. Rushed, random or contradictory answers can get a completed survey rejected and the points reversed. Taking surveys honestly and at a normal pace is the most reliable way to keep the points you earn.',
    steps: ['Read every question fully before answering', 'Keep your answers consistent with your profile', 'Avoid straight-lining (picking the same option for every row)', 'Skip surveys you cannot finish honestly instead of rushing them'] },
  { tag: 'android-app',
    why: 'The Profitpiller Android app on Google Play gives you the same surveys, offers, streak and cash-out options as the website, in a format built for short sessions. It is handy for fitting a survey into a coffee break and for keeping your streak going when you are away from a computer.',
    steps: ['Install Profitpiller from Google Play', 'Sign in with the same account you use on the web', 'Enable notifications so you hear about new surveys', 'Cash out from the app once you reach the $5 minimum'] },
  { tag: 'daily-check',
    why: 'Survey inventory changes throughout the day as researchers open and close projects. Members who check in regularly see more of the surveys that fit them before quotas fill up, which is why a short daily visit usually beats one long session a week.',
    steps: ['Pick one or two regular times a day to check for surveys', 'Start with the newest surveys - quotas fill quickly', 'Keep an eye on the length estimate so sessions stay short', 'Combine the visit with your daily streak survey'] },
  { tag: 'levels',
    why: 'Profitpiller levels reflect how active you have been. As you complete surveys and offers you climb through levels, which tracks your progress and can unlock level rewards. Levels reward consistency rather than big one-off sessions.',
    steps: ['Check your current level and progress bar in your account', 'Complete surveys and offers regularly to keep progressing', 'Look out for rewards attached to new levels', 'Treat levels as a progress tracker, not a guaranteed payout'] },
  { tag: 'app-offers',
    why: 'App and game offers reward you for reaching a goal in a partner app - a certain game level, a completed tutorial or a first in-app action. They can be a good fit if you enjoy trying new apps, but always check whether an offer needs a purchase; there are plenty that do not.',
    steps: ['Filter for offers that are free to complete', 'Install through the Profitpiller link so the offer can track', 'Reach the stated milestone within the time limit', 'Uninstall only after the points are confirmed'] },
  { tag: 'short-surveys',
    why: 'Short surveys take only a few minutes each, so they fit easily around other things. Each pays fewer points than a long survey, but finishing several short ones is a low-pressure way to build your balance and keep your streak alive.',
    steps: ['Sort or scan for surveys with low minute estimates', 'Finish them in one sitting so they are not timed out', 'Keep answers honest even when the survey is quick', 'Track how many points you average per session'] },
  { tag: 'offer-rules',
    why: 'Most offers that do not credit fail because a requirement was missed - a different device, an ad blocker, an earlier install of the same app, or a step done outside the time limit. Reading and following the instructions exactly is the simplest way to make offers pay out.',
    steps: ['Read the full instructions and any small print', 'Turn off ad blockers and VPNs before starting', 'Use a fresh install - previously installed apps usually do not qualify', 'Screenshot your progress in case you need to contact support'] },
  { tag: 'bonus-codes',
    why: 'From time to time Profitpiller shares bonus or promo codes that add points to your balance when redeemed. Codes are usually time-limited and announced through official Profitpiller channels, so following those channels is the easiest way not to miss one.',
    steps: ['Follow Profitpiller on its official social channels', 'Open the Redeem section in your account', 'Enter the code exactly as written before it expires', 'Ignore "codes" from unofficial sources that ask for your login'] },
  { tag: 'leaderboard',
    why: 'The leaderboard shows the most active members over a period. It is a fun way to benchmark your own activity and stay motivated, but there is no need to chase the top spots - steady, honest activity is what moves your own balance toward a cash-out.',
    steps: ['Check the leaderboard to see how active periods compare', 'Set a personal weekly goal instead of chasing rankings', 'Keep survey quality high even when you are competing', 'Use the leaderboard as motivation, not as a target you must hit'] },
];

/** Opening sentence that depends on the outcome being discussed. */
const OUTCOME_INTROS: string[] = [
  'Every survey, offer and offer-wall task you complete on Profitpiller adds points to a single balance.',
  'PayPal is one of the most popular ways to cash out on Profitpiller once your balance reaches the $5 minimum.',
  'Members in India can cash out to UPI once they reach the $5 minimum, which makes small, regular withdrawals easy.',
  'Amazon gift cards are a popular Profitpiller reward because they are flexible and delivered digitally.',
  'Visa gift cards let you spend your Profitpiller rewards almost anywhere cards are accepted, where available in your country.',
  'Google Play credit is a natural fit if you mostly use Profitpiller on the Android app.',
  'Your first cash-out is a milestone: Profitpiller lets you withdraw from just $5, so you can test the process early.',
  'Bonus points on Profitpiller come from things like bonus codes, streak milestones and promotions on top of your regular activity.',
  'Levels on Profitpiller track how active you are and can unlock level rewards as you progress.',
  'Extra survey points come from being matched to more surveys and finishing the ones you start.',
  'Profitpiller offers a range of gift cards, and the brands available depend on your country.',
  'Referral points let you earn something extra when friends you invite join Profitpiller and stay active.',
];

const TIPS = [
  'Set aside a short, fixed window each day - 10 to 15 minutes is enough to check new surveys and keep your streak going.',
  'Complete every profile section first; better-matched surveys mean fewer screen-outs.',
  'Cash out as soon as you reach the $5 minimum the first time, so you know exactly how the process works for your payout method.',
  'Check more than one offer wall - each partner has different tasks on any given day.',
  'Turn on notifications in the Profitpiller Android app so you see new surveys while their quotas are still open.',
  'Prefer surveys that show a realistic length estimate you can finish in one sitting.',
  'Keep a simple note of offers you started and when, so you can follow up if one does not credit.',
  'Answer at a normal reading pace - speeding through questions is a common reason for rejected surveys.',
  'Use the same account on the website and the app so your points, streak and level stay in one place.',
  'Pick the payout method that suits you: PayPal, UPI where available, or a gift card from the Cashout page.',
] as const;

const WARNINGS = [
  'Profitpiller is free to join - never pay anyone who promises to "unlock" more surveys or faster payouts.',
  'Screen-outs are a normal part of surveys; they mean the researcher needed a different audience, not that you did something wrong.',
  'Inconsistent, random or rushed answers can get completed surveys rejected and the points reversed.',
  'Using VPNs, multiple accounts or someone else’s payout details breaks the terms and can lead to account closure.',
  'Surveys and offers are a way to earn some extra rewards, not a replacement for a regular income - amounts vary by country and availability.',
  'Profitpiller staff will never ask for your password; only enter bonus codes from official Profitpiller channels.',
  'Some offers require a purchase or a subscription - read the requirements and skip the ones you would not otherwise pay for.',
] as const;

const FAQ_BANK: { question: string; answer: string }[] = [
  { question: 'How much can I earn on Profitpiller?', answer: 'It varies. Earnings depend on how many surveys you qualify for, your country, how complete your profile is and how much time you spend. Think of it as extra rewards for your spare time rather than a guaranteed income.' },
  { question: 'What is the minimum cash-out?', answer: 'You can cash out once your balance reaches the equivalent of $5. Options include PayPal, UPI (where available) and gift cards such as Amazon, Visa and Google Play, depending on your country.' },
  { question: 'How long do payouts take?', answer: 'Cash-out requests are reviewed before they are sent. Many are processed within a few business days, though a first withdrawal or an extra verification check can take longer. Gift cards are delivered digitally once approved.' },
  { question: 'Why was I screened out of a survey?', answer: 'Researchers look for specific audiences and quotas fill up quickly. A screen-out simply means you were not a match for that study. Keeping your profile complete and accurate helps you see better-matched surveys.' },
  { question: 'Why was a completed survey rejected?', answer: 'Survey partners run quality checks. Answers that are inconsistent with your profile, too fast, or that fail attention checks can be rejected. Answering honestly and at a normal pace is the best protection.' },
  { question: 'Is there a Profitpiller app?', answer: 'Yes. Profitpiller is available on Google Play for Android. It uses the same account as the website, so your points, streak, level and cash-out options are shared.' },
  { question: 'What does the daily streak give me?', answer: 'Your streak counts the days in a row on which you complete at least one survey. It unlocks badges and streak milestones rather than cash, and it is a good way to build a routine.' },
  { question: 'How does the referral program work?', answer: 'Share your personal invite link from the Refer section. When friends join through your link and stay active, you can earn referral points. Referrals must be real people - self-referrals are not allowed.' },
  { question: 'Do I need to pay anything to use Profitpiller?', answer: 'No. Profitpiller is free. Some third-party offers may involve a purchase or trial, and those are always shown in the offer requirements so you can choose to skip them.' },
  { question: 'Why has an offer not credited yet?', answer: 'Advertisers confirm offers before points are released, which can take from minutes to several days. If the stated time has passed, contact support with the offer name and the date you completed it.' },
  { question: 'Which gift cards can I get?', answer: 'The catalogue depends on your country. Popular choices include Amazon, Visa and Google Play gift cards. The Cashout page in your account always shows the options available to you.' },
  { question: 'Is my personal information safe?', answer: 'Profitpiller uses your profile to match you with surveys and explains how data is handled in its Privacy Policy. Never share your password, and only cash out to payout accounts in your own name.' },
];

/** Category-specific section added to every article. */
const CATEGORY_SECTIONS: Record<BlogCategory, { heading: string; text: string }> = {
  earn: { heading: 'Where Your Points Come From', text: 'On Profitpiller, points come from three main places: paid surveys, sponsored offers and partner offer walls. Surveys are usually the steadiest source, while offers can pay more for a single task but take longer to confirm. Mixing the two keeps your balance moving.' },
  save: { heading: 'Making Rewards Go Further', text: 'Rewards are most useful when they cover something you would buy anyway. Choosing a gift card for a store you already use, or cashing out to PayPal or UPI for everyday spending, turns spare-time survey points into real savings without changing your habits.' },
  rewards: { heading: 'Choosing Your Reward', text: 'Once you reach the $5 minimum you can choose how to cash out: PayPal, UPI where available, or a gift card such as Amazon, Visa or Google Play. Pick the option you will actually use - the Cashout page shows what is available in your country.' },
  'passive-income': { heading: 'Keeping Expectations Realistic', text: 'Profitpiller is a flexible way to earn some extra rewards in spare moments, not passive income that arrives without effort. The members who get the most out of it treat it as a small routine: a few surveys a day, an occasional offer, and regular cash-outs.' },
  gaming: { heading: 'Games and App Offers', text: 'Game and app offers reward you for reaching milestones in partner apps. Choose offers that are free to complete, install through the Profitpiller link so progress tracks, and check the time limit - some milestones take days of play.' },
  guides: { heading: 'Your First Week on Profitpiller', text: 'Day one: sign up and complete your profile. Days two to four: take a few surveys each day and start a streak. Days five to seven: try one offer and one offer wall, then cash out as soon as you reach $5 to see how payouts work for you.' },
};

const AUTHOR = { name: 'Profitpiller Editorial Team', avatar: '/assets/images/logo_23.png' };

/** Static, shareable og:image per category (the on-page cover is drawn as inline SVG). */
export function blogCategoryImage(category: BlogCategory): string {
  return `/assets/images/blog/blog-${category}.jpg`;
}

// ---- Generator --------------------------------------------------------

function titleFor(a: number, o: number, m: number, c: number): string {
  return `${ACTIONS[a]} ${OUTCOMES[o]} by ${METHODS[m]} ${CONTEXTS[c]}`;
}

function lower(s: string): string {
  // Lower-case for mid-sentence use while keeping brand and payout names intact.
  return s.toLowerCase()
    .replace(/profitpiller/g, 'Profitpiller').replace(/paypal/g, 'PayPal').replace(/\bupi\b/g, 'UPI')
    .replace(/amazon/g, 'Amazon').replace(/visa/g, 'Visa').replace(/google play/g, 'Google Play')
    .replace(/android/g, 'Android');
}

function pickDistinct<T>(rng: () => number, arr: readonly T[], count: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < count && pool.length) {
    out.push(pool.splice(Math.floor(rng() * pool.length) % pool.length, 1)[0]);
  }
  return out;
}

function buildFromParts(index: number, actionI: number, outcomeI: number, methodI: number, contextI: number, categoryI: number): BlogPost {
  const action = ACTIONS[actionI];
  const outcome = OUTCOMES[outcomeI];
  const method = METHODS[methodI];
  const context = CONTEXTS[contextI];
  const category = CATEGORIES[categoryI];
  const detail = METHOD_DETAILS[methodI];
  const catSection = CATEGORY_SECTIONS[category];

  const title = titleFor(actionI, outcomeI, methodI, contextI);
  const slug = slugWithIndex(title, index);
  const rng = seededRandom(index + 1); // +1 so index 0 isn't an all-zero seed

  const readMinutes = randInt(rng, 4, 8);
  const dayOffset = randInt(rng, 0, 720); // spread "publish dates" over ~2 years
  const published = new Date(Date.now() - dayOffset * 86400000).toISOString();
  const updated = new Date(Date.now() - Math.floor(dayOffset / 3) * 86400000).toISOString();

  const [tipA, tipB] = pickDistinct(rng, TIPS, 2);
  const warning = pick(rng, WARNINGS);
  const faqs = pickDistinct(rng, FAQ_BANK, 3);

  const content: BlogContentBlock[] = [
    { type: 'paragraph', text: `${OUTCOME_INTROS[outcomeI]} This guide looks at how ${lower(method)} helps you ${lower(action)} ${lower(outcome)} ${lower(context)} - what to do, what to expect, and how to avoid the mistakes that cost members points.` },
    { type: 'heading', heading: `How ${method} Works on Profitpiller` },
    { type: 'paragraph', text: detail.why },
    { type: 'tip', text: tipA },
    { type: 'heading', heading: 'Step-by-Step' },
    { type: 'list', items: detail.steps },
    { type: 'heading', heading: catSection.heading },
    { type: 'paragraph', text: catSection.text },
    { type: 'heading', heading: 'Cash-Out Options and Timing' },
    { type: 'paragraph', text: 'Your points are worth the same whichever way you earn them. Once your balance reaches the equivalent of $5 you can request a cash-out. Requests are reviewed before they are sent, so allow a few business days - a little longer for your first withdrawal.' },
    { type: 'table', tableHeaders: ['Payout option', 'Minimum', 'Good to know'], tableRows: [
      ['PayPal', '$5', 'Sent to the PayPal account in your name'],
      ['UPI', '$5 equivalent', 'Available for members in India'],
      ['Gift cards', '$5', 'Amazon, Visa, Google Play and more - varies by country'],
    ] },
    { type: 'heading', heading: 'What to Expect' },
    { type: 'paragraph', text: `How much you earn ${lower(context)} depends on how many surveys you qualify for, your country, your profile and the time you put in. Some days you will match several surveys, other days fewer. Treat Profitpiller as a way to earn extra rewards, not a guaranteed income.` },
    { type: 'tip', text: tipB },
    { type: 'warning', text: warning },
    { type: 'faq', faqs },
  ];

  const description = `How to ${lower(action)} ${lower(outcome)} by ${lower(method)} ${lower(context)}: practical steps, cash-out options from $5 and realistic expectations.`;

  return {
    id: `blog-${index}`,
    slug,
    title,
    metaTitle: `${title} | Profitpiller`,
    metaDescription: description,
    excerpt: `${OUTCOME_INTROS[outcomeI]} Practical steps for ${lower(method)} ${lower(context)}.`,
    category,
    tags: [category, detail.tag, 'profitpiller'],
    coverImage: blogCategoryImage(category),
    author: AUTHOR,
    publishedAt: published,
    updatedAt: updated,
    readMinutes,
    content,
    relatedSlugs: relatedIndexes(index, 3).map(i => indexToTitleSlug(i)),
  };
}

function indexToTitleSlug(index: number): string {
  const [a, o, m, c] = decompose(index, BANK_LENGTHS);
  return slugWithIndex(titleFor(a, o, m, c), index);
}

/** Deterministic set of "related" indexes in the same category, without repeating this one. */
function relatedIndexes(index: number, count: number): number[] {
  const rng = seededRandom(index + 777);
  const base = BANK_LENGTHS.slice(0, 4).reduce((a, b) => a * b, 1);
  const categoryStart = Math.floor(index / base) * base;
  const out = new Set<number>();
  while (out.size < count) {
    const candidate = categoryStart + randInt(rng, 0, base - 1);
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

/**
 * Listing order: position i shows index (i * LIST_STRIDE) mod total. The stride is
 * coprime with both the full space and a single category's size, so this is a
 * permutation (every post still appears exactly once) while consecutive cards mix
 * different actions, outcomes, methods and contexts instead of only the first word.
 */
const LIST_STRIDE = 7919;

/** Page of summaries, optionally filtered to one category, for the list view. */
export function listBlogSummaries(opts: { page: number; pageSize: number; category?: BlogCategory }): {
  items: BlogPostSummary[]; totalItems: number; totalPages: number;
} {
  const categoryIndex = opts.category ? CATEGORIES.indexOf(opts.category) : -1;

  if (categoryIndex < 0) {
    const totalItems = BLOG_SPACE;
    const start = (opts.page - 1) * opts.pageSize;
    const items = Array.from({ length: opts.pageSize }, (_, i) => start + i)
      .filter(i => i < totalItems)
      .map(i => generateBlogSummary((i * LIST_STRIDE) % totalItems));
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
    .map(i => generateBlogSummary(categoryIndex * base + ((i * LIST_STRIDE) % base)));
  return { items, totalItems, totalPages: Math.ceil(totalItems / opts.pageSize) };
}

/** Lightweight deterministic "search": scans a bounded window and keyword-matches titles. */
export function searchBlogSummaries(query: string, limit = 24, category?: BlogCategory): BlogPostSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: BlogPostSummary[] = [];
  const base = BANK_LENGTHS.slice(0, 4).reduce((a, b) => a * b, 1);
  const categoryIndex = category ? CATEGORIES.indexOf(category) : -1;
  const offset = categoryIndex >= 0 ? categoryIndex * base : 0;
  const scanLimit = Math.min(categoryIndex >= 0 ? base : BLOG_SPACE, 5000);
  for (let i = 0; i < scanLimit && results.length < limit; i++) {
    const summary = generateBlogSummary(offset + i);
    if (summary.title.toLowerCase().includes(q) || summary.category.includes(q) || summary.tags.some(t => t.includes(q))) {
      results.push(summary);
    }
  }
  return results;
}

export { parseIndexFromSlug };
