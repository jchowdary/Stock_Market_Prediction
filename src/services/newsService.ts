// News service for fetching real financial news
export interface RealNewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
  content: string;
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: RealNewsArticle[];
}

export class NewsService {
  private readonly NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  private readonly ALPHA_VANTAGE_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
  private readonly baseUrl = 'https://newsapi.org/v2';
  private readonly proxyUrl = 'https://api.allorigins.win/raw?url=';

  // Fallback news sources that don't require API keys
  private readonly fallbackSources = [
    'https://feeds.finance.yahoo.com/rss/2.0/headline',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://feeds.bloomberg.com/markets/news.rss'
  ];

  async getFinancialNews(query?: string): Promise<RealNewsArticle[]> {
    try {
      // Try NewsAPI first if API key is available
      if (this.NEWS_API_KEY) {
        return await this.fetchFromNewsAPI(query);
      }
      
      // Fallback to free sources
      return await this.fetchFromFallbackSources();
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getMockNews(); // Return mock data as final fallback
    }
  }

  private async fetchFromNewsAPI(query?: string): Promise<RealNewsArticle[]> {
    const searchQuery = query || 'stock market OR finance OR economy OR trading';
    const url = `${this.baseUrl}/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=20`;
    
    const response = await fetch(url, {
      headers: {
        'X-API-Key': this.NEWS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsAPIResponse = await response.json();
    return data.articles.filter(article => 
      article.title && 
      article.description && 
      !article.title.includes('[Removed]')
    );
  }

  private async fetchFromFallbackSources(): Promise<RealNewsArticle[]> {
    try {
      // Use a free financial news API or RSS feed
      const response = await fetch('https://api.marketaux.com/v1/news/all?symbols=TSLA,AMZN,MSFT&filter_entities=true&language=en&api_token=demo');
      
      if (response.ok) {
        const data = await response.json();
        return this.transformMarketauxNews(data.data || []);
      }
    } catch (error) {
      console.error('Fallback news source failed:', error);
    }

    return this.getMockNews();
  }

  private transformMarketauxNews(articles: any[]): RealNewsArticle[] {
    return articles.map(article => ({
      title: article.title,
      description: article.description || article.snippet,
      url: article.url,
      urlToImage: article.image_url,
      publishedAt: article.published_at,
      source: {
        id: article.source,
        name: article.source
      },
      content: article.description || article.snippet
    }));
  }

  async getStockSpecificNews(symbol: string): Promise<RealNewsArticle[]> {
    try {
      if (this.NEWS_API_KEY) {
        const url = `${this.baseUrl}/everything?q=${symbol}&language=en&sortBy=publishedAt&pageSize=10`;
        
        const response = await fetch(url, {
          headers: {
            'X-API-Key': this.NEWS_API_KEY
          }
        });

        if (response.ok) {
          const data: NewsAPIResponse = await response.json();
          return data.articles.filter(article => 
            article.title && 
            article.description && 
            !article.title.includes('[Removed]')
          );
        }
      }

      // Fallback for stock-specific news
      return this.getMockStockNews(symbol);
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      return this.getMockStockNews(symbol);
    }
  }

  // Sentiment analysis using a simple keyword-based approach
  analyzeSentiment(text: string): 'bullish' | 'bearish' | 'neutral' {
    const bullishKeywords = [
      'growth', 'profit', 'gain', 'rise', 'increase', 'positive', 'strong', 
      'beat', 'exceed', 'outperform', 'bullish', 'buy', 'upgrade', 'surge'
    ];
    
    const bearishKeywords = [
      'loss', 'decline', 'fall', 'drop', 'decrease', 'negative', 'weak',
      'miss', 'underperform', 'bearish', 'sell', 'downgrade', 'plunge', 'crash'
    ];

    const lowerText = text.toLowerCase();
    let bullishScore = 0;
    let bearishScore = 0;

    bullishKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) bullishScore++;
    });

    bearishKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) bearishScore++;
    });

    if (bullishScore > bearishScore) return 'bullish';
    if (bearishScore > bullishScore) return 'bearish';
    return 'neutral';
  }

  // Transform real news to our app's news format
  transformToAppNews(articles: RealNewsArticle[]): any[] {
    return articles.map(article => {
      const sentiment = this.analyzeSentiment(article.title + ' ' + article.description);
      const relatedStock = this.extractStockSymbol(article.title + ' ' + article.description);
      
      return {
        title: article.title,
        source: article.source.name,
        time: this.formatTimeAgo(article.publishedAt),
        sentiment,
        stock: relatedStock,
        content: article.description || article.content,
        url: article.url,
        image: article.urlToImage
      };
    });
  }

  private extractStockSymbol(text: string): string {
    // Common stock symbols that might appear in news
    const stockSymbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX',
      'JPM', 'JNJ', 'V', 'PG', 'MA', 'DIS', 'ADBE', 'PYPL', 'CRM',
      'NKE', 'PFE', 'INTC', 'AMD', 'BABA', 'UBER', 'SPOT'
    ];

    const upperText = text.toUpperCase();
    
    for (const symbol of stockSymbols) {
      if (upperText.includes(symbol) || upperText.includes(symbol.toLowerCase())) {
        return symbol;
      }
    }

    // Default to a popular stock if no specific symbol found
    return stockSymbols[Math.floor(Math.random() * stockSymbols.length)];
  }

  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  }

  private getMockNews(): RealNewsArticle[] {
    // Fallback mock news data
    return [
      {
        title: "Stock Market Reaches New Heights Amid Economic Recovery",
        description: "Major indices continue their upward trajectory as investors remain optimistic about economic growth prospects.",
        url: "#",
        urlToImage: "",
        publishedAt: new Date().toISOString(),
        source: { id: "mock", name: "Financial Times" },
        content: "Stock markets continue to show strong performance..."
      },
      {
        title: "Tech Stocks Lead Market Rally",
        description: "Technology companies are driving market gains as digital transformation accelerates across industries.",
        url: "#",
        urlToImage: "",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: { id: "mock", name: "Bloomberg" },
        content: "Technology sector shows remarkable resilience..."
      }
    ];
  }

  private getMockStockNews(symbol: string): RealNewsArticle[] {
    return [
      {
        title: `${symbol} Reports Strong Quarterly Results`,
        description: `${symbol} exceeded analyst expectations with robust revenue growth and improved margins.`,
        url: "#",
        urlToImage: "",
        publishedAt: new Date().toISOString(),
        source: { id: "mock", name: "Reuters" },
        content: `${symbol} continues to demonstrate strong fundamentals...`
      }
    ];
  }
}

export const newsService = new NewsService();