export type BlogCategory =
  | 'earn'
  | 'save'
  | 'rewards'
  | 'passive-income'
  | 'gaming'
  | 'guides';

export interface BlogContentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'tip' | 'warning' | 'table' | 'image' | 'faq';
  heading?: string;
  text?: string;
  items?: string[];
  tableHeaders?: string[];
  tableRows?: string[][];
  imageUrl?: string;
  imageAlt?: string;
  faqs?: { question: string; answer: string }[];
}

export interface BlogPost {
  id: string;
  slug: string;                 // used for the dynamic /blog/:slug route
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  coverImage: string;
  author: { name: string; avatar: string };
  publishedAt: string;          // ISO date
  updatedAt: string;
  readMinutes: number;
  estimatedEarnings?: string;   // e.g. "$25–$60" — feeds the value-tag ribbon
  content: BlogContentBlock[];
  relatedSlugs: string[];
  canonicalUrl?: string;
}

// Lightweight shape used for list/grid views so we never ship the
// full `content` payload (which can be large) to a listing page.
export type BlogPostSummary = Omit<BlogPost, 'content' | 'relatedSlugs'>;
