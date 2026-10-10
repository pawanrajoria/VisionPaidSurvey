/**
 * Deterministic SVG cover-art generator for blog posts, guides and gift cards.
 *
 * There are 100k+ generated pages, far too many for static image files, so
 * every cover is *drawn* from (title, category, seed): the same inputs always
 * give the same picture. Pure string building - no DOM, no randomness outside
 * the seeded RNG - so it runs identically on the server (SSR) and in the browser,
 * and can also be executed at build time to export static og:image files.
 *
 * Canvas: 1200 x 630 (the Open Graph size). Left side: eyebrow + wrapped title.
 * Right side: a category/topic illustration (survey clipboard, coins, gift card,
 * phone, trophy, streak flame, ...) whose palette, tilt and decorations vary by seed.
 */

export type CoverIcon =
  | 'survey' | 'coins' | 'giftcard' | 'phone' | 'trophy' | 'flame'
  | 'friends' | 'offerwall' | 'profile' | 'wallet' | 'gamepad' | 'book';

export interface CoverOptions {
  title: string;
  /** Category slug, used for the fallback icon and the eyebrow label. */
  category: string;
  /** Any integer; drives palette, tilt and decorations. */
  seed: number;
  /** Small label above the title. Defaults to a label derived from the category. */
  eyebrow?: string;
  /** Force an illustration; otherwise picked from title keywords / category. */
  icon?: CoverIcon;
  /** Gift-card covers: brand name and amount printed on the card. */
  brand?: string;
  amount?: string;
  /** Set false to draw only the illustration (no title text). */
  showTitle?: boolean;
}

export const COVER_WIDTH = 1200;
export const COVER_HEIGHT = 630;

const PALETTES: [string, string, string][] = [
  ['#0a3a31', '#105749', '#23a37a'],
  ['#062b24', '#0f5345', '#1d8f6b'],
  ['#0b3f35', '#0f6b55', '#2bb489'],
  ['#08332b', '#134e4a', '#0f766e'],
  ['#0a3a31', '#0f5345', '#3fb98b'],
];

/** Gift-card face colours per gift-card category (all readable with white text). */
const CARD_FACES: Record<string, [string, string]> = {
  shopping: ['#f59e0b', '#b45309'],
  gaming: ['#7c3aed', '#4c1d95'],
  streaming: ['#e11d48', '#9f1239'],
  'food-delivery': ['#ea580c', '#9a3412'],
  crypto: ['#0284c7', '#075985'],
  'prepaid-visa': ['#1d4ed8', '#1e3a8a'],
  travel: ['#0d9488', '#115e59'],
};

const CATEGORY_LABELS: Record<string, string> = {
  earn: 'Earn', save: 'Save smarter', rewards: 'Rewards', 'passive-income': 'Side income',
  gaming: 'Games & apps', guides: 'Guide', shopping: 'Shopping', streaming: 'Streaming & apps',
  'food-delivery': 'Food & delivery', crypto: 'Crypto', 'prepaid-visa': 'Prepaid cards', travel: 'Travel',
};

const CATEGORY_ICONS: Record<string, CoverIcon> = {
  earn: 'coins', save: 'wallet', rewards: 'giftcard', 'passive-income': 'phone',
  gaming: 'gamepad', guides: 'book',
};

/** Keyword rules, checked in order (topic words before payout words). */
const KEYWORD_ICONS: [RegExp, CoverIcon][] = [
  [/streak/i, 'flame'],
  [/friend|referr|invit/i, 'friends'],
  [/profile/i, 'profile'],
  [/offer ?wall/i, 'offerwall'],
  [/level|leaderboard/i, 'trophy'],
  [/android|\bapp\b|phone|mobile/i, 'phone'],
  [/survey|questionnaire|poll|opinion/i, 'survey'],
  [/game|gaming/i, 'gamepad'],
  [/offer|bonus code|promo/i, 'coins'],
  [/gift card|amazon|visa|google play/i, 'giftcard'],
  [/paypal|upi|cash|payout|\$5/i, 'wallet'],
  [/guide|step by step|beginner/i, 'book'],
];

export function coverIconFor(title: string, category: string): CoverIcon {
  for (const [re, icon] of KEYWORD_ICONS) if (re.test(title)) return icon;
  return CATEGORY_ICONS[category] ?? 'coins';
}

export function coverLabelFor(category: string): string {
  return CATEGORY_LABELS[category] ?? 'Profitpiller';
}

// ---- helpers ------------------------------------------------------------

function rng(seed: number): () => number {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Greedy word wrap by estimated glyph width; ellipsis on overflow. */
export function wrapTitle(title: string, maxChars: number, maxLines: number): string[] {
  const words = title.trim().split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars || !cur) cur = next;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length <= maxLines) return lines;
  const out = lines.slice(0, maxLines);
  let last = out[maxLines - 1];
  while (last.length > maxChars - 1 && last.includes(' ')) last = last.replace(/\s+\S+$/, '');
  out[maxLines - 1] = `${last}\u2026`;
  return out;
}

function sparkle(x: number, y: number, r: number, fill: string, opacity = 1): string {
  const k = r * 0.28;
  return `<path d="M${x} ${y - r}Q${x + k} ${y - k} ${x + r} ${y}Q${x + k} ${y + k} ${x} ${y + r}Q${x - k} ${y + k} ${x - r} ${y}Q${x - k} ${y - k} ${x} ${y - r}Z" fill="${fill}" opacity="${opacity}"/>`;
}

function coin(x: number, y: number, r: number, id: string, label = '$'): string {
  return `<g><circle cx="${x}" cy="${y + r * 0.12}" r="${r}" fill="#b45309"/>`
    + `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}-gold)"/>`
    + `<circle cx="${x}" cy="${y}" r="${r * 0.74}" fill="none" stroke="#fef3c7" stroke-opacity=".7" stroke-width="${Math.max(2, r * 0.07)}"/>`
    + `<text x="${x}" y="${y + r * 0.36}" text-anchor="middle" font-size="${r}" font-weight="900" fill="#78350f" font-family="Work Sans, Arial, sans-serif">${label}</text></g>`;
}

// ---- illustrations (drawn in a 400 x 400 box) -------------------------------

function drawIcon(icon: CoverIcon, id: string, r: () => number, o: CoverOptions): string {
  const W = '#ffffff';
  const MINT = '#a7f3d0';
  const GREEN = '#23a37a';
  const DARK = '#0a3a31';
  switch (icon) {
    case 'survey': {
      const checked = 2 + Math.floor(r() * 2);
      let rows = '';
      for (let i = 0; i < 4; i++) {
        const y = 130 + i * 58;
        const on = i < checked;
        rows += `<rect x="108" y="${y}" width="34" height="34" rx="9" fill="${on ? GREEN : '#e6f4ee'}"/>`
          + (on ? `<path d="M116 ${y + 17}l8 8 13-15" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` : '')
          + `<rect x="158" y="${y + 6}" width="${120 - (i % 2) * 34}" height="10" rx="5" fill="#cfe7dd"/>`
          + `<rect x="158" y="${y + 22}" width="${74 + (i % 3) * 14}" height="8" rx="4" fill="#e3f1eb"/>`;
      }
      return `<rect x="78" y="62" width="250" height="320" rx="26" fill="#063028" opacity=".35" transform="translate(10 12)"/>`
        + `<rect x="78" y="62" width="250" height="320" rx="26" fill="${W}"/>`
        + `<rect x="148" y="44" width="110" height="44" rx="14" fill="url(#${id}-gold)"/>`
        + `<circle cx="203" cy="58" r="8" fill="#78350f" opacity=".5"/>` + rows
        + coin(318, 334, 46, id);
    }
    case 'coins': {
      let stack = '';
      for (let i = 0; i < 5; i++) {
        const y = 300 - i * 30;
        stack += `<ellipse cx="150" cy="${y + 10}" rx="92" ry="28" fill="#b45309"/>`
          + `<ellipse cx="150" cy="${y}" rx="92" ry="28" fill="url(#${id}-gold)"/>`
          + `<ellipse cx="150" cy="${y}" rx="64" ry="17" fill="none" stroke="#fef3c7" stroke-opacity=".6" stroke-width="4"/>`;
      }
      return `<ellipse cx="200" cy="350" rx="170" ry="26" fill="#000" opacity=".18"/>` + stack
        + coin(285, 210, 82, id) + coin(250, 80, 40, id, 'P');
    }
    case 'giftcard': {
      const face = CARD_FACES[o.category] ?? ['#fde047', '#f59e0b'];
      const dark = !CARD_FACES[o.category];
      const ink = dark ? '#422006' : '#ffffff';
      const brand = esc((o.brand ?? 'Gift Card').replace(/ Prepaid$/, '').slice(0, 18));
      const amount = o.amount ? esc(o.amount) : '';
      const bsize = brand.length > 14 ? 20 : brand.length > 12 ? 22 : brand.length > 9 ? 26 : 32;
      return `<defs><linearGradient id="${id}-face" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${face[0]}"/><stop offset="1" stop-color="${face[1]}"/></linearGradient></defs>`
        + `<g transform="rotate(-8 200 220)">`
        + `<rect x="40" y="110" width="330" height="210" rx="24" fill="#000" opacity=".22" transform="translate(12 16)"/>`
        + `<rect x="40" y="110" width="330" height="210" rx="24" fill="url(#${id}-face)"/>`
        + `<rect x="40" y="110" width="330" height="210" rx="24" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3"/>`
        + `<rect x="296" y="110" width="28" height="210" fill="#fff" opacity=".85"/>`
        + `<rect x="40" y="190" width="330" height="26" fill="#fff" opacity=".85"/>`
        + `<ellipse cx="288" cy="190" rx="28" ry="17" fill="#fff" transform="rotate(-25 288 190)"/>`
        + `<ellipse cx="334" cy="190" rx="28" ry="17" fill="#fff" transform="rotate(25 334 190)"/>`
        + `<circle cx="310" cy="202" r="12" fill="#fde047"/>`
        + `<text x="64" y="160" font-size="${bsize}" font-weight="900" fill="${ink}" font-family="Work Sans, Arial, sans-serif">${brand}</text>`
        + (amount ? `<text x="64" y="296" font-size="44" font-weight="900" fill="${ink}" font-family="Work Sans, Arial, sans-serif">${amount}</text>` : '')
        + `</g>` + sparkle(360, 92, 22, '#fde047');
    }
    case 'phone': {
      let tiles = '';
      for (let i = 0; i < 3; i++) {
        const y = 128 + i * 62;
        tiles += `<rect x="128" y="${y}" width="150" height="48" rx="12" fill="${W}"/>`
          + `<circle cx="152" cy="${y + 24}" r="12" fill="${i === 0 ? '#f59e0b' : GREEN}"/>`
          + `<rect x="172" y="${y + 14}" width="${80 - i * 12}" height="8" rx="4" fill="#cfe7dd"/>`
          + `<rect x="172" y="${y + 28}" width="${56 + i * 8}" height="7" rx="3.5" fill="#e3f1eb"/>`;
      }
      return `<rect x="96" y="40" width="214" height="350" rx="38" fill="#000" opacity=".25" transform="translate(10 12)"/>`
        + `<rect x="96" y="40" width="214" height="350" rx="38" fill="#0b1f1a"/>`
        + `<rect x="110" y="56" width="186" height="318" rx="28" fill="#ecfdf5"/>`
        + `<rect x="170" y="66" width="66" height="12" rx="6" fill="#0b1f1a"/>`
        + `<rect x="128" y="92" width="110" height="14" rx="7" fill="${DARK}" opacity=".85"/>` + tiles
        + `<rect x="128" y="320" width="150" height="34" rx="17" fill="url(#${id}-gold)"/>`
        + coin(318, 110, 44, id);
    }
    case 'trophy':
      return `<ellipse cx="200" cy="372" rx="130" ry="18" fill="#000" opacity=".2"/>`
        + `<path d="M110 92h180v70c0 62-40 104-90 104s-90-42-90-104z" fill="url(#${id}-gold)"/>`
        + `<path d="M110 112H70c0 50 22 78 52 84M290 112h40c0 50-22 78-52 84" fill="none" stroke="#f59e0b" stroke-width="16" stroke-linecap="round"/>`
        + `<rect x="182" y="262" width="36" height="46" fill="#d97706"/>`
        + `<rect x="128" y="300" width="144" height="56" rx="12" fill="${DARK}"/>`
        + `<rect x="150" y="318" width="100" height="18" rx="9" fill="${MINT}" opacity=".9"/>`
        + `<path d="M200 128l14 29 32 4-23 22 6 32-29-15-29 15 6-32-23-22 32-4z" fill="#fff" opacity=".92"/>`
        + sparkle(320, 70, 24, '#fde047') + sparkle(76, 250, 16, MINT, .8);
    case 'flame': {
      const days = 3 + Math.floor(r() * 5);
      let dots = '';
      for (let i = 0; i < 7; i++) {
        dots += `<circle cx="${80 + i * 40}" cy="360" r="14" fill="${i < days ? '#f59e0b' : '#ffffff'}" opacity="${i < days ? 1 : .25}"/>`;
      }
      return `<path d="M200 36c22 64 104 104 104 196a104 104 0 0 1-208 0c0-54 32-82 52-120 6 34 20 52 40 60-8-56-4-96 12-136z" fill="url(#${id}-flame)"/>`
        + `<path d="M204 170c14 40 56 60 56 108a58 58 0 0 1-116 0c0-30 18-48 30-70 6 22 16 32 28 36-6-30 0-52 2-74z" fill="#fde047"/>`
        + `<text x="200" y="306" text-anchor="middle" font-size="58" font-weight="900" fill="#7c2d12" font-family="Work Sans, Arial, sans-serif">${days}</text>`
        + dots;
    }
    case 'friends':
      return `<circle cx="200" cy="130" r="56" fill="${W}"/><path d="M106 320c0-64 42-108 94-108s94 44 94 108z" fill="${W}"/>`
        + `<circle cx="96" cy="176" r="40" fill="${MINT}"/><path d="M28 330c0-48 30-80 68-80s68 32 68 80z" fill="${MINT}"/>`
        + `<circle cx="304" cy="176" r="40" fill="${MINT}"/><path d="M236 330c0-48 30-80 68-80s68 32 68 80z" fill="${MINT}"/>`
        + `<circle cx="200" cy="130" r="56" fill="none" stroke="${GREEN}" stroke-width="6"/>`
        + `<circle cx="330" cy="70" r="36" fill="url(#${id}-gold)"/><path d="M330 52v36M312 70h36" stroke="#422006" stroke-width="9" stroke-linecap="round"/>`
        + `<rect x="60" y="342" width="280" height="20" rx="10" fill="#000" opacity=".15"/>`;
    case 'offerwall': {
      let grid = '';
      const colors = [W, MINT, W, '#fde047', W, MINT, W, MINT, W];
      const star = Math.floor(r() * 9);
      for (let i = 0; i < 9; i++) {
        const x = 70 + (i % 3) * 92;
        const y = 70 + Math.floor(i / 3) * 92;
        const c = i === star ? `url(#${id}-gold)` : colors[i];
        grid += `<rect x="${x}" y="${y}" width="78" height="78" rx="18" fill="${c}"/>`
          + (i === star
            ? `<path d="M${x + 39} ${y + 18}l7 14 15 2-11 11 3 15-14-7-14 7 3-15-11-11 15-2z" fill="#78350f"/>`
            : `<circle cx="${x + 39}" cy="${y + 32}" r="12" fill="${GREEN}" opacity=".85"/><rect x="${x + 18}" y="${y + 52}" width="42" height="8" rx="4" fill="#cfe7dd"/>`);
      }
      return `<rect x="50" y="50" width="300" height="300" rx="30" fill="#000" opacity=".2" transform="translate(10 12)"/>`
        + `<rect x="50" y="50" width="300" height="300" rx="30" fill="#0f5345"/>` + grid
        + sparkle(358, 44, 22, '#fde047');
    }
    case 'profile': {
      const pct = 60 + Math.floor(r() * 35);
      return `<rect x="50" y="80" width="300" height="250" rx="26" fill="#000" opacity=".22" transform="translate(10 12)"/>`
        + `<rect x="50" y="80" width="300" height="250" rx="26" fill="${W}"/>`
        + `<rect x="50" y="80" width="300" height="64" rx="26" fill="${GREEN}"/><rect x="50" y="120" width="300" height="24" fill="${GREEN}"/>`
        + `<circle cx="120" cy="170" r="44" fill="${MINT}" stroke="#fff" stroke-width="8"/>`
        + `<circle cx="120" cy="160" r="16" fill="${DARK}" opacity=".75"/><path d="M92 198c4-18 16-26 28-26s24 8 28 26z" fill="${DARK}" opacity=".75"/>`
        + `<rect x="184" y="160" width="130" height="14" rx="7" fill="#cfe7dd"/><rect x="184" y="184" width="90" height="10" rx="5" fill="#e3f1eb"/>`
        + `<rect x="80" y="244" width="240" height="18" rx="9" fill="#e3f1eb"/>`
        + `<rect x="80" y="244" width="${2.4 * pct}" height="18" rx="9" fill="url(#${id}-gold)"/>`
        + `<text x="80" y="300" font-size="22" font-weight="800" fill="${DARK}" font-family="Work Sans, Arial, sans-serif">${pct}%</text>`;
    }
    case 'wallet':
      return `<ellipse cx="200" cy="360" rx="160" ry="20" fill="#000" opacity=".2"/>`
        + coin(150, 110, 48, id) + coin(250, 84, 38, id)
        + `<rect x="50" y="130" width="300" height="210" rx="30" fill="#0b1f1a"/>`
        + `<rect x="50" y="150" width="300" height="190" rx="30" fill="url(#${id}-wallet)"/>`
        + `<rect x="250" y="206" width="110" height="74" rx="20" fill="${DARK}"/>`
        + `<circle cx="286" cy="243" r="14" fill="#fde047"/>`
        + `<rect x="78" y="182" width="120" height="12" rx="6" fill="#fff" opacity=".35"/>`;
    case 'gamepad':
      return `<ellipse cx="200" cy="350" rx="160" ry="20" fill="#000" opacity=".2"/>`
        + `<path d="M120 130h160c56 0 86 50 86 120 0 54-24 84-56 84-34 0-44-46-74-46h-72c-30 0-40 46-74 46-32 0-56-30-56-84 0-70 30-120 86-120z" fill="${W}"/>`
        + `<rect x="98" y="206" width="70" height="22" rx="8" fill="${DARK}"/><rect x="122" y="182" width="22" height="70" rx="8" fill="${DARK}"/>`
        + `<circle cx="276" cy="198" r="15" fill="#f59e0b"/><circle cx="310" cy="230" r="15" fill="${GREEN}"/>`
        + `<circle cx="242" cy="230" r="15" fill="${GREEN}"/><circle cx="276" cy="262" r="15" fill="#f59e0b"/>`
        + coin(320, 92, 40, id);
    case 'book':
    default:
      return `<ellipse cx="200" cy="350" rx="170" ry="20" fill="#000" opacity=".2"/>`
        + `<path d="M200 100c-40-26-100-30-150-20v240c50-10 110-6 150 20z" fill="${W}"/>`
        + `<path d="M200 100c40-26 100-30 150-20v240c-50-10-110-6-150 20z" fill="#ecfdf5"/>`
        + `<path d="M200 100v240" stroke="#cfe7dd" stroke-width="6"/>`
        + `<rect x="80" y="140" width="90" height="10" rx="5" fill="#cfe7dd"/><rect x="80" y="168" width="100" height="10" rx="5" fill="#cfe7dd"/><rect x="80" y="196" width="70" height="10" rx="5" fill="#cfe7dd"/>`
        + `<rect x="230" y="140" width="90" height="10" rx="5" fill="#a7f3d0"/><rect x="230" y="168" width="100" height="10" rx="5" fill="#a7f3d0"/>`
        + `<path d="M232 210l20 20 42-46" fill="none" stroke="${GREEN}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<path d="M300 66v70l18-14 18 14V66z" fill="url(#${id}-gold)"/>`;
  }
}

// ---- main ---------------------------------------------------------------

export function renderCoverSvg(o: CoverOptions): string {
  const seed = Math.abs(Math.floor(o.seed)) || 1;
  const r = rng(seed);
  const id = `ppc${o.icon ?? ''}${seed.toString(36)}${o.category.length}`;
  const [c0, c1, c2] = PALETTES[seed % PALETTES.length];
  const icon = o.icon ?? coverIconFor(o.title, o.category);
  const tilt = Math.round((r() - 0.5) * 10);
  const angle = Math.round(r() * 60) + 110;
  const showTitle = o.showTitle !== false;

  // Background decorations
  let deco = '';
  deco += `<circle cx="${980 + Math.round(r() * 120)}" cy="${60 + Math.round(r() * 80)}" r="${180 + Math.round(r() * 80)}" fill="#a7f3d0" opacity=".08"/>`;
  deco += `<circle cx="${Math.round(r() * 300)}" cy="${560 + Math.round(r() * 60)}" r="${150 + Math.round(r() * 90)}" fill="#fde047" opacity=".07"/>`;
  deco += `<circle cx="${760 + Math.round(r() * 120)}" cy="${470 + Math.round(r() * 80)}" r="${60 + Math.round(r() * 40)}" fill="none" stroke="#a7f3d0" stroke-opacity=".18" stroke-width="3"/>`;
  for (let i = 0; i < 4; i++) {
    const x = 700 + Math.round(r() * 460);
    const y = 50 + Math.round(r() * 530);
    deco += sparkle(x, y, 8 + Math.round(r() * 12), i % 2 ? '#fde047' : '#a7f3d0', .55 + r() * .4);
  }

  // Title block
  let text = '';
  if (showTitle) {
    const rawEyebrow = (o.eyebrow ?? coverLabelFor(o.category)).toUpperCase();
    const eyebrow = esc(rawEyebrow);
    const ew = Math.round(rawEyebrow.length * 14 + 44);
    text += `<rect x="72" y="74" width="${ew}" height="42" rx="21" fill="url(#${id}-gold)"/>`
      + `<text x="94" y="102" font-size="19" font-weight="800" letter-spacing="1.5" fill="#422006" font-family="Work Sans, Arial, sans-serif">${eyebrow}</text>`;
    const len = o.title.length;
    const fs = len <= 34 ? 64 : len <= 60 ? 54 : len <= 84 ? 48 : 42;
    const maxChars = Math.floor(600 / (fs * 0.56));
    const lines = wrapTitle(o.title, maxChars, 5);
    const lh = Math.round(fs * 1.16);
    const top = 170 + fs;
    text += `<text font-size="${fs}" font-weight="900" fill="#ffffff" letter-spacing="-0.5" font-family="Work Sans, Arial, sans-serif">`
      + lines.map((l, i) => `<tspan x="72" y="${top + i * lh}">${esc(l)}</tspan>`).join('')
      + `</text>`;
    text += `<circle cx="86" cy="566" r="12" fill="#23a37a"/><circle cx="86" cy="566" r="5" fill="#fde047"/>`
      + `<text x="108" y="574" font-size="24" font-weight="800" fill="#a7f3d0" font-family="Work Sans, Arial, sans-serif">Profitpiller</text>`;
  }

  // Illustration placement: right side when there is a title, centered otherwise.
  const place = showTitle ? 'translate(740 110) scale(1.02)' : 'translate(330 35) scale(1.35)';
  const art = `<g transform="${place}"><g transform="rotate(${tilt} 200 200)">${drawIcon(icon, id, r, o)}</g></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COVER_WIDTH} ${COVER_HEIGHT}" width="${COVER_WIDTH}" height="${COVER_HEIGHT}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">`
    + `<defs>`
    + `<linearGradient id="${id}-bg" gradientTransform="rotate(${angle - 90} .5 .5)"><stop offset="0" stop-color="${c0}"/><stop offset=".6" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`
    + `<linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fde047"/><stop offset="1" stop-color="#f59e0b"/></linearGradient>`
    + `<linearGradient id="${id}-flame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#ea580c"/></linearGradient>`
    + `<linearGradient id="${id}-wallet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#23a37a"/><stop offset="1" stop-color="#0f5345"/></linearGradient>`
    + `<pattern id="${id}-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill="#a7f3d0" opacity=".12"/></pattern>`
    + `</defs>`
    + `<rect width="${COVER_WIDTH}" height="${COVER_HEIGHT}" fill="url(#${id}-bg)"/>`
    + `<rect x="640" width="560" height="${COVER_HEIGHT}" fill="url(#${id}-dots)"/>`
    + deco + art + text
    + `</svg>`;
}
