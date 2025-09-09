export interface NewsArticle {
  title: string;
  source: string;
  time: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  stock: string;
  content: string;
  url?: string;
  image?: string;
}