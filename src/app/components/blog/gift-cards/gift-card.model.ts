export type GiftCardCategory =
  | 'gaming'
  | 'shopping'
  | 'streaming'
  | 'food-delivery'
  | 'crypto'
  | 'prepaid-visa'
  | 'travel';

export interface GiftCardDenomination {
  amount: number;               // e.g. 10, 25, 50, 100
  currency: string;              // e.g. 'USD'
  pointsRequired: number;        // internal wallet points needed to redeem
  inStock: boolean;
}

export interface GiftCardFaq {
  question: string;
  answer: string;
}

export interface GiftCard {
  id: string;
  slug: string;                  // used for the dynamic /gift-cards/:slug route
  brand: string;                 // e.g. "Amazon", "Steam", "DoorDash"
  title: string;                 // e.g. "Amazon Gift Card"
  metaTitle: string;
  metaDescription: string;
  category: GiftCardCategory;
  logoUrl: string;
  heroImage: string;
  shortDescription: string;
  longDescription: string;
  denominations: GiftCardDenomination[];
  howToRedeem: string[];
  termsAndConditions: string[];
  countriesAvailable: string[];
  rating: number;                // 0–5
  reviewCount: number;
  popularityRank: number;
  faqs: GiftCardFaq[];
  relatedSlugs: string[];
  updatedAt: string;
}

export type GiftCardSummary = Pick<
  GiftCard,
  | 'id' | 'slug' | 'brand' | 'title' | 'category' | 'logoUrl'
  | 'shortDescription' | 'denominations' | 'rating' | 'reviewCount' | 'popularityRank'
>;
