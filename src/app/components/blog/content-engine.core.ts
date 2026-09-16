/**
 * Zero-storage programmatic content engine — core primitives.
 *
 * The idea: instead of storing one JSON file or DB row per page, every
 * page's content is *computed* on the fly from its numeric position
 * (`index`) using pure, deterministic functions. The same index always
 * produces the exact same content, forever, with no database, no JSON
 * files, and no API - just arithmetic over fixed word banks.
 *
 * This is the same "deterministic modular arithmetic" approach already
 * used by ProfitPiller's SEO content system.
 */

/**
 * Splits a single integer `index` into N independent "digits", one per
 * word bank, using modular arithmetic (a mixed-radix number system where
 * each "digit" has its own base = that word bank's length).
 *
 * Example: decompose(137, [12, 15, 6]) picks bank-0 index (137 % 12),
 * then bank-1 index from what's left, etc. Every index in
 * [0, product(lengths)) maps to a unique combination of picks, and the
 * same index always decomposes the same way.
 */
export function decompose(index: number, lengths: number[]): number[] {
  let remaining = Math.floor(index);
  const picks: number[] = [];
  for (const len of lengths) {
    picks.push(((remaining % len) + len) % len);
    remaining = Math.floor(remaining / len);
  }
  return picks;
}

/** Total number of unique combinations addressable by decompose() for these bank lengths. */
export function combinationSpace(lengths: number[]): number {
  return lengths.reduce((a, b) => a * b, 1);
}

/**
 * Small, fast, deterministic pseudo-random generator (mulberry32) seeded
 * from an integer. Used for anything that needs to look "random" per page
 * (a rating, a review count, a stock flag) while staying perfectly
 * reproducible for the same index — no state, no storage.
 */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic integer in [min, max] from a seeded RNG. */
export function randInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Deterministic float in [min, max], rounded to `decimals` places. */
export function randFloat(rng: () => number, min: number, max: number, decimals = 1): number {
  const v = min + rng() * (max - min);
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}

/** Pick one element deterministically from an array using an rng. */
export function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Builds a URL slug that embeds its own numeric index (e.g.
 * "earn-extra-cash-with-surveys-4821"), so `parseIndexFromSlug` can
 * recover the index with zero lookups - the slug IS the address.
 */
export function slugWithIndex(title: string, index: number): string {
  return `${slugify(title)}-${index}`;
}

/**
 * Extracts the trailing numeric index from a slug produced by
 * `slugWithIndex`. Returns null if the slug doesn't end in a number
 * (i.e. it was never a page this engine generated).
 */
export function parseIndexFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  if (!match) return null;
  return parseInt(match[1], 10);
}
