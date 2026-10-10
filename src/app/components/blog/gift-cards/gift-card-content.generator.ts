import { GiftCard, GiftCardCategory, GiftCardDenomination, GiftCardFaq, GiftCardSummary } from './gift-card.model';
import { giftCardAmountLabel } from './gift-card-format';
import { decompose, combinationSpace, seededRandom, randInt, slugWithIndex, parseIndexFromSlug } from '../content-engine.core';

// ---- Word banks ---------------------------------------------------
// Brand + denomination + region are genuinely distinct products (a
// $25 vs $50 Amazon card in USD vs GBP really are different SKUs).
// "Occasion" is a lighter angle layer on top of a real SKU, not a
// separate product - each occasion page targets a different real
// search intent ("gift card for birthday" vs "gift card for gaming")
// for the same underlying card.
//
// Copy rules: these pages describe redeeming Profitpiller points (earned from
// surveys, offers and offer walls) for gift cards. Cash-outs start at $5, the
// catalogue differs by country, and requests are reviewed before delivery -
// so nothing here promises instant delivery, stock levels or ratings.

const BRANDS: { name: string; category: GiftCardCategory; logo: string }[] = [
  { name: 'Amazon', category: 'shopping', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Walmart', category: 'shopping', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Target', category: 'shopping', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Best Buy', category: 'shopping', logo: '/assets/images/icon/gift-2.png' },
  { name: 'eBay', category: 'shopping', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Home Depot', category: 'shopping', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Steam', category: 'gaming', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'PlayStation', category: 'gaming', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Xbox', category: 'gaming', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Nintendo eShop', category: 'gaming', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Roblox', category: 'gaming', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Netflix', category: 'streaming', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Spotify', category: 'streaming', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Disney+', category: 'streaming', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Google Play', category: 'streaming', logo: '/assets/images/icon/gift-2.png' },
  { name: 'DoorDash', category: 'food-delivery', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Uber Eats', category: 'food-delivery', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Grubhub', category: 'food-delivery', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Starbucks', category: 'food-delivery', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Coinbase', category: 'crypto', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Visa Prepaid', category: 'prepaid-visa', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Mastercard Prepaid', category: 'prepaid-visa', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'American Express Prepaid', category: 'prepaid-visa', logo: '/assets/images/icon/gift-card1.jpg' },
  { name: 'Airbnb', category: 'travel', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Uber', category: 'travel', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Delta Airlines', category: 'travel', logo: '/assets/images/icon/gift-2.png' },
  { name: 'Marriott', category: 'travel', logo: '/assets/images/icon/gift-2.png' },
] as const;

const DENOMINATIONS = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200] as const;

const REGIONS: { name: string; currency: string }[] = [
  { name: 'US', currency: 'USD' },
  { name: 'UK', currency: 'GBP' },
  { name: 'Canada', currency: 'CAD' },
  { name: 'Australia', currency: 'AUD' },
  { name: 'Europe', currency: 'EUR' },
];

const OCCASIONS = [
  'Digital Delivery', 'for Gaming', 'as a Gift', 'for Shopping Online',
  'for Birthdays', 'for the Holidays', 'for Everyday Use', 'for Subscriptions',
  'for Family', 'Digital Code',
] as const;

const BANK_LENGTHS = [BRANDS.length, DENOMINATIONS.length, REGIONS.length, OCCASIONS.length];
export const GIFTCARD_SPACE = combinationSpace(BANK_LENGTHS);

const HOW_TO_REDEEM_TEMPLATES = (brand: string, face: string) => [
  'Earn points on Profitpiller by taking surveys, completing offers and exploring offer walls - on the web or in the Android app',
  `When your balance covers the card (cash-outs start at $5), open the Cashout page and choose ${brand}`,
  `Select the ${face} amount for your region and confirm the request`,
  'Your request is reviewed, then the digital code is delivered to your Profitpiller account and email',
  `Apply the code in the official ${brand} store, website or app`,
];

const TERMS_TEMPLATES = (brand: string, region: string) => [
  `The ${brand} gift card is subject to ${brand}\u2019s own terms and is intended for the ${region} storefront`,
  'Brands, amounts and regions offered can change and depend on the country of your Profitpiller account',
  'Cash-out requests are reviewed before delivery; digital codes cannot be exchanged or refunded once delivered',
  'One Profitpiller account per person; rewards earned through VPNs, duplicate accounts or dishonest answers can be cancelled',
  `${brand} is a trademark of its owner and is not a sponsor of Profitpiller`,
];

function faqBank(brand: string, currency: string, region: string): GiftCardFaq[] {
  return [
    { question: `How many points do I need for a ${brand} gift card?`, answer: 'The point price for every card and amount is shown on the Cashout page in your Profitpiller account. Cash-outs start at the equivalent of $5.' },
    { question: `How long does it take to receive my ${brand} code?`, answer: 'Cash-out requests are reviewed before they are sent. Many are processed within a few business days; a first cash-out or an extra verification check can take longer. The code arrives in your account and by email.' },
    { question: `Can I use this card outside ${region}?`, answer: `This card is issued in ${currency} for the ${region} storefront. Gift cards are usually region-locked, so pick the region that matches your ${brand} account.` },
    { question: `Is ${brand} available in my country?`, answer: 'The gift card catalogue depends on your country. If a brand is not listed on your Cashout page, PayPal, UPI (where available) or another gift card may be offered instead.' },
    { question: 'How do I earn points faster?', answer: 'Complete your profile so you match more surveys, check for new surveys daily, keep your streak going, and try offer walls. Earnings vary by country and availability, so treat it as extra rewards rather than a fixed income.' },
    { question: 'What if my code doesn\u2019t work?', answer: 'Contact Profitpiller support from your account with the cash-out details and we\u2019ll look into it with the provider.' },
  ];
}

/** Static, shareable og:image per gift-card category (the on-page cover is drawn as inline SVG). */
export function giftCardCategoryImage(category: GiftCardCategory): string {
  return `/assets/images/blog/giftcard-${category}.jpg`;
}

function buildFromParts(index: number, brandI: number, denomI: number, regionI: number, occasionI: number): GiftCard {
  const brand = BRANDS[brandI];
  const amount = DENOMINATIONS[denomI];
  const region = REGIONS[regionI];
  const occasion = OCCASIONS[occasionI];

  const face = giftCardAmountLabel(amount, region.currency);
  const displayTitle = `${brand.name} Gift Card ${face} (${region.name}) - ${occasion}`;
  const slug = slugWithIndex(`${brand.name}-gift-card-${amount}-${region.name}-${occasion}`, index);

  const popularityRank = (index % 1000) + 1;

  // Point prices and availability live in the member's Cashout page, so the
  // public page lists face values only - no invented prices, stock or ratings.
  const denominations: GiftCardDenomination[] = DENOMINATIONS.map(d => ({
    amount: d,
    currency: region.currency,
    pointsRequired: 0,
    inStock: true,
  }));

  return {
    id: `gc-${index}`,
    slug,
    brand: brand.name,
    title: displayTitle,
    metaTitle: `${displayTitle} | Profitpiller`,
    metaDescription: `Redeem Profitpiller points for a ${face} ${brand.name} gift card (${region.name}) - ${occasion.toLowerCase()}. Earn with surveys and offers, cash out from $5.`,
    category: brand.category,
    logoUrl: giftCardCategoryImage(brand.category),
    heroImage: giftCardCategoryImage(brand.category),
    shortDescription: `Turn the points you earn from surveys and offers into a ${face} ${brand.name} gift card for ${region.name} - ${occasion.toLowerCase()}.`,
    longDescription: `${brand.name} gift cards are one of the reward options on Profitpiller, where members earn points by taking paid surveys, completing sponsored offers and exploring partner offer walls. Once your balance covers the card - cash-outs start at $5 - you can request a ${face} ${brand.name} card for the ${region.name} storefront from the Cashout page. After a quick review the digital code is delivered to your account, so there is nothing to ship. Which brands and amounts you see depends on your country, and PayPal or UPI may be available as alternatives.`,
    denominations,
    howToRedeem: HOW_TO_REDEEM_TEMPLATES(brand.name, face),
    termsAndConditions: TERMS_TEMPLATES(brand.name, region.name),
    countriesAvailable: [region.name],
    rating: 0,
    reviewCount: 0,
    popularityRank,
    faqs: faqBank(brand.name, region.currency, region.name),
    relatedSlugs: relatedIndexes(index, 4).map(indexToSlug),
    updatedAt: new Date(Date.now() - (index % 60) * 86400000).toISOString(),
  };
}

function indexToSlug(index: number): string {
  const [b, d, r, o] = decompose(index, BANK_LENGTHS);
  return slugWithIndex(`${BRANDS[b].name}-gift-card-${DENOMINATIONS[d]}-${REGIONS[r].name}-${OCCASIONS[o]}`, index);
}

function relatedIndexes(index: number, count: number): number[] {
  // Same brand, different denomination/region/occasion: brand is the fastest
  // digit, so every index of the form brandI + BRANDS.length * k is that brand.
  const rng = seededRandom(index + 333);
  const [brandI] = decompose(index, BANK_LENGTHS);
  const perBrand = GIFTCARD_SPACE / BRANDS.length;
  const out = new Set<number>();
  let attempts = 0;
  while (out.size < count && attempts < 50) {
    attempts++;
    const candidate = brandI + BRANDS.length * randInt(rng, 0, perBrand - 1);
    if (candidate !== index) out.add(candidate);
  }
  return Array.from(out);
}

export function generateGiftCard(index: number): GiftCard {
  const safeIndex = ((index % GIFTCARD_SPACE) + GIFTCARD_SPACE) % GIFTCARD_SPACE;
  const [b, d, r, o] = decompose(safeIndex, BANK_LENGTHS);
  return buildFromParts(safeIndex, b, d, r, o);
}

export function generateGiftCardSummary(index: number): GiftCardSummary {
  const { longDescription, howToRedeem, termsAndConditions, countriesAvailable, faqs, relatedSlugs, updatedAt, metaTitle, metaDescription, heroImage, ...summary } = generateGiftCard(index);
  return summary;
}

export function getGiftCardBySlug(slug: string): GiftCard | null {
  const index = parseIndexFromSlug(slug);
  if (index === null || index < 0 || index >= GIFTCARD_SPACE) return null;
  return generateGiftCard(index);
}

export function listGiftCardSummaries(opts: {
  page: number; pageSize: number; category?: GiftCardCategory; sort?: 'popular' | 'rating' | 'az';
}): { items: GiftCardSummary[]; totalItems: number; totalPages: number } {
  const brandIndexesInCategory = opts.category
    ? BRANDS.map((b, i) => (b.category === opts.category ? i : -1)).filter(i => i >= 0)
    : null;

  const perBrand = DENOMINATIONS.length * REGIONS.length * OCCASIONS.length;
  const totalItems = brandIndexesInCategory ? brandIndexesInCategory.length * perBrand : GIFTCARD_SPACE;

  const start = (opts.page - 1) * opts.pageSize;
  const rangeIdx = Array.from({ length: opts.pageSize }, (_, i) => start + i).filter(i => i < totalItems);

  // Coprime stride: a permutation of the listing that mixes brands, amounts,
  // regions and occasions on every page instead of only the first digit.
  const LIST_STRIDE = 7919;
  let items: GiftCardSummary[];
  if (brandIndexesInCategory) {
    items = rangeIdx.map(pos => (pos * LIST_STRIDE) % totalItems).map(offset => {
      const brandPos = Math.floor(offset / perBrand);
      const withinBrand = offset % perBrand;
      const brandI = brandIndexesInCategory[brandPos];
      // Reconstruct the absolute index for this brand + offset-within-brand
      const [d, r, o] = decompose(withinBrand, BANK_LENGTHS.slice(1));
      const absoluteIndex = decomposeToIndex([brandI, d, r, o], BANK_LENGTHS);
      return generateGiftCardSummary(absoluteIndex);
    });
  } else {
    items = rangeIdx.map(pos => generateGiftCardSummary((pos * LIST_STRIDE) % totalItems));
  }

  if (opts.sort === 'rating') items = [...items].sort((a, b) => b.denominations.length - a.denominations.length || a.popularityRank - b.popularityRank);
  if (opts.sort === 'az') items = [...items].sort((a, b) => a.brand.localeCompare(b.brand));
  if (opts.sort === 'popular' || !opts.sort) items = [...items].sort((a, b) => a.popularityRank - b.popularityRank);

  return { items, totalItems, totalPages: Math.ceil(totalItems / opts.pageSize) };
}

/** Inverse of decompose(): rebuilds the single index from its per-bank digit picks. */
function decomposeToIndex(picks: number[], lengths: number[]): number {
  let index = 0;
  let multiplier = 1;
  for (let i = 0; i < picks.length; i++) {
    index += picks[i] * multiplier;
    multiplier *= lengths[i];
  }
  return index;
}

export function listGiftCardCategories(): { category: GiftCardCategory; label: string; count: number }[] {
  const perBrand = DENOMINATIONS.length * REGIONS.length * OCCASIONS.length;
  const counts = new Map<GiftCardCategory, number>();
  for (const b of BRANDS) counts.set(b.category, (counts.get(b.category) ?? 0) + perBrand);
  const labels: Record<GiftCardCategory, string> = {
    gaming: 'Gaming', shopping: 'Shopping', streaming: 'Streaming & Apps',
    'food-delivery': 'Food & Delivery', crypto: 'Crypto', 'prepaid-visa': 'Prepaid Visa', travel: 'Travel',
  };
  return Array.from(counts.entries()).map(([category, count]) => ({ category, label: labels[category], count }));
}
