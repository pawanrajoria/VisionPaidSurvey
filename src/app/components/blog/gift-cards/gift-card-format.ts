import { GiftCardSummary } from './gift-card.model';

/** The face value this page is about (parsed from the "-gift-card-25-" part of its slug). */
export function giftCardAmount(card: Pick<GiftCardSummary, 'slug' | 'denominations'>): number {
  const match = card.slug.match(/-gift-card-(\d+)-/);
  return match ? parseInt(match[1], 10) : (card.denominations[0]?.amount ?? 0);
}

/** "$25", "£25", "€25", "CA$25"... formatted without decimals. */
export function giftCardAmountLabel(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}
