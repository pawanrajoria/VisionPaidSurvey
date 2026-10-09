import { GiftCard, GiftCardCategory, GiftCardDenomination, GiftCardFaq, GiftCardSummary } from './gift-card.model';
import { decompose, combinationSpace, seededRandom, randInt, randFloat, pick, slugWithIndex, parseIndexFromSlug } from '../content-engine.core';

// ---- Word banks ---------------------------------------------------
// Brand + denomination + region are genuinely distinct products (a
// $25 vs $50 Amazon card in USD vs GBP really are different SKUs).
// "Occasion" is a lighter angle layer on top of a real SKU, not a
// separate product - each occasion page targets a different real
// search intent ("gift card for birthday" vs "gift card for gaming")
// for the same underlying card.

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
  { name: 'Hulu', category: 'streaming', logo: '/assets/images/icon/gift-2.png' },
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
  'Instant Delivery', 'for Gaming', 'as a Gift', 'for Shopping Online',
  'for Birthdays', 'for the Holidays', 'for Everyday Use', 'for Subscriptions',
  'for Family', 'Digital Code',
] as const;

const BANK_LENGTHS = [BRANDS.length, DENOMINATIONS.length, REGIONS.length, OCCASIONS.length];
export const GIFTCARD_SPACE = combinationSpace(BANK_LENGTHS);

const HOW_TO_REDEEM_TEMPLATES = (brand: string) => [
  `Add the ${brand} gift card to your ProfitPiller wallet balance`,
  `Choose your denomination and confirm the redemption`,
  `Receive your digital code by email within minutes`,
  `Apply the code at checkout on the ${brand} website or app`,
];

const TERMS_TEMPLATES = (brand: string) => [
  `Valid only for purchases made directly through ${brand}'s official store or app`,
  'Digital codes are non-refundable once delivered',
  'No expiration date unless otherwise stated by the issuing brand',
  `Not redeemable for cash except where required by law`,
];

function faqBank(brand: string, currency: string): GiftCardFaq[] {
  return [
    { question: `How fast will I receive my ${brand} gift card?`, answer: 'Digital codes are delivered to your account instantly after redemption, typically within a few minutes.' },
    { question: `Can I use this ${brand} gift card internationally?`, answer: `This card is denominated in ${currency} and is intended for use in its issuing region's storefront.` },
    { question: 'Does the balance expire?', answer: 'Most gift card balances do not expire, but check the brand\u2019s own terms for region-specific rules.' },
    { question: 'What if my code doesn\u2019t work?', answer: 'Contact support with your order reference and we\u2019ll verify and reissue the code if needed.' },
  ];
}

function buildFromParts(index: number, brandI: number, denomI: number, regionI: number, occasionI: number): GiftCard {
  const brand = BRANDS[brandI];
  const amount = DENOMINATIONS[denomI];
  const region = REGIONS[regionI];
  const occasion = OCCASIONS[occasionI];

  const displayTitle = `${brand.name} Gift Card $${amount} (${region.name}) - ${occasion}`;
  const slug = slugWithIndex(`${brand.name}-gift-card-${amount}-${region.name}-${occasion}`, index);
  const rng = seededRandom(index + 1);

  const rating = randFloat(rng, 3.9, 5.0, 1);
  const reviewCount = randInt(rng, 120, 8400);
  const popularityRank = (index % 1000) + 1;

  const denominations: GiftCardDenomination[] = DENOMINATIONS.map(d => ({
    amount: d,
    currency: region.currency,
    pointsRequired: d * randInt(seededRandom(index + d), 90, 110),
    inStock: rng() > 0.05,
  }));

  return {
    id: `gc-${index}`,
    slug,
    brand: brand.name,
    title: displayTitle,
    metaTitle: `${displayTitle} | ProfitPiller`,
    metaDescription: `Redeem a $${amount} ${brand.name} gift card (${region.name}) with your ProfitPiller points - ${occasion.toLowerCase()}. Instant digital delivery.`,
    category: brand.category,
    logoUrl: brand.logo,
    heroImage: brand.logo,
    shortDescription: `A $${amount} ${brand.name} gift card for ${region.name}, delivered instantly - ${occasion.toLowerCase()}.`,
    longDescription: `The ${brand.name} gift card is one of our most popular redemptions for ${region.name} members. This $${amount} denomination gives you flexible spending power on ${brand.name}, with your digital code delivered straight to your account the moment you redeem it - no shipping, no waiting.`,
    denominations,
    howToRedeem: HOW_TO_REDEEM_TEMPLATES(brand.name),
    termsAndConditions: TERMS_TEMPLATES(brand.name),
    countriesAvailable: [region.name],
    rating,
    reviewCount,
    popularityRank,
    faqs: faqBank(brand.name, region.currency),
    relatedSlugs: relatedIndexes(index, 4).map(indexToSlug),
    updatedAt: new Date(Date.now() - (index % 60) * 86400000).toISOString(),
  };
}

function indexToSlug(index: number): string {
  const [b, d, r, o] = decompose(index, BANK_LENGTHS);
  return slugWithIndex(`${BRANDS[b].name}-gift-card-${DENOMINATIONS[d]}-${REGIONS[r].name}-${OCCASIONS[o]}`, index);
}

function relatedIndexes(index: number, count: number): number[] {
  const rng = seededRandom(index + 333);
  const [brandI] = decompose(index, BANK_LENGTHS);
  const out = new Set<number>();
  let attempts = 0;
  while (out.size < count && attempts < 50) {
    attempts++;
    const candidate = randInt(rng, 0, GIFTCARD_SPACE - 1);
    // Bias toward same-brand related cards (different denomination/region/occasion)
    if (decompose(candidate, BANK_LENGTHS)[0] === brandI && candidate !== index) {
      out.add(candidate);
    }
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

  let items: GiftCardSummary[];
  if (brandIndexesInCategory) {
    items = rangeIdx.map(offset => {
      const brandPos = Math.floor(offset / perBrand);
      const withinBrand = offset % perBrand;
      const brandI = brandIndexesInCategory[brandPos];
      // Reconstruct the absolute index for this brand + offset-within-brand
      const [d, r, o] = decompose(withinBrand, BANK_LENGTHS.slice(1));
      const absoluteIndex = decomposeToIndex([brandI, d, r, o], BANK_LENGTHS);
      return generateGiftCardSummary(absoluteIndex);
    });
  } else {
    items = rangeIdx.map(generateGiftCardSummary);
  }

  if (opts.sort === 'rating') items = [...items].sort((a, b) => b.rating - a.rating);
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
    gaming: 'Gaming', shopping: 'Shopping', streaming: 'Streaming',
    'food-delivery': 'Food & Delivery', crypto: 'Crypto', 'prepaid-visa': 'Prepaid Visa', travel: 'Travel',
  };
  return Array.from(counts.entries()).map(([category, count]) => ({ category, label: labels[category], count }));
}
