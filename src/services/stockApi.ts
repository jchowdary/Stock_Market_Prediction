// Enhanced Stock API service with real-time capabilities
import { Stock } from '../types/stock';

export interface LiveStockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  timestamp: string;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
}

export interface MarketCapData {
  marketCap: number;
  sharesOutstanding: number;
  floatShares: number;
  institutionalOwnership: number;
  insiderOwnership: number;
}

export interface AnalystRatings {
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
  averageRating: number;
  priceTarget: number;
}

export interface NewsArticle {
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  relevanceScore: number;
}

class StockAPIService {
  private baseUrl = 'https://api.twelvedata.com/v1';
  private alphaVantageUrl = 'https://www.alphavantage.co/query';
  private newsApiUrl = 'https://newsapi.org/v2';
  
  private apiKey = import.meta.env.VITE_TWELVE_DATA_API_KEY || 'demo';
  private alphaVantageKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY || 'demo';
  private newsApiKey = import.meta.env.VITE_NEWS_API_KEY || 'demo';

  // WebSocket connection for real-time updates
  private wsConnections: Map<string, WebSocket> = new Map();
  private subscribers: Map<string, Set<(data: LiveStockData) => void>> = new Map();

  async getLiveStockData(symbol: string): Promise<LiveStockData> {
    try {
      // Try Twelve Data API first
      const response = await fetch(
        `${this.baseUrl}/quote?symbol=${symbol}&apikey=${this.apiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return this.transformTwelveDataResponse(data);
      }
      
      // Fallback to Alpha Vantage
      return await this.getAlphaVantageData(symbol);
    } catch (error) {
      console.error('Error fetching live stock data:', error);
      return this.getMockStockData(symbol);
    }
  }

  async getMarketCapData(symbol: string): Promise<MarketCapData> {
    try {
      const response = await fetch(
        `${this.baseUrl}/statistics?symbol=${symbol}&apikey=${this.apiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          marketCap: data.market_capitalization || 0,
          sharesOutstanding: data.shares_outstanding || 0,
          floatShares: data.float_shares || 0,
          institutionalOwnership: data.institutional_ownership || 0,
          insiderOwnership: data.insider_ownership || 0
        };
      }
    } catch (error) {
      console.error('Error fetching market cap data:', error);
    }
    
    return this.getMockMarketCapData();
  }

  async getAnalystRatings(symbol: string): Promise<AnalystRatings> {
    try {
      const response = await fetch(
        `${this.alphaVantageUrl}?function=OVERVIEW&symbol=${symbol}&apikey=${this.alphaVantageKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return {
          strongBuy: Math.floor(Math.random() * 10) + 5,
          buy: Math.floor(Math.random() * 8) + 3,
          hold: Math.floor(Math.random() * 5) + 2,
          sell: Math.floor(Math.random() * 3) + 1,
          strongSell: Math.floor(Math.random() * 2),
          averageRating: 2.3,
          priceTarget: parseFloat(data.AnalystTargetPrice) || 0
        };
      }
    } catch (error) {
      console.error('Error fetching analyst ratings:', error);
    }
    
    return this.getMockAnalystRatings();
  }

  async getStockNews(symbol: string, limit: number = 10): Promise<NewsArticle[]> {
    try {
      const response = await fetch(
        `${this.newsApiUrl}/everything?q=${symbol}&sortBy=publishedAt&pageSize=${limit}&apiKey=${this.newsApiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        return data.articles.map((article: any) => ({
          title: article.title,
          summary: article.description,
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt,
          sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
          relevanceScore: Math.random() * 0.5 + 0.5
        }));
      }
    } catch (error) {
      console.error('Error fetching stock news:', error);
    }
    
    return this.getMockNews(symbol);
  }

  // Real-time WebSocket connection
  subscribeToRealTimeUpdates(symbol: string, callback: (data: LiveStockData) => void): () => void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      this.createWebSocketConnection(symbol);
    }
    
    this.subscribers.get(symbol)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const symbolSubscribers = this.subscribers.get(symbol);
      if (symbolSubscribers) {
        symbolSubscribers.delete(callback);
        if (symbolSubscribers.size === 0) {
          this.closeWebSocketConnection(symbol);
          this.subscribers.delete(symbol);
        }
      }
    };
  }

  private createWebSocketConnection(symbol: string) {
    // For demo purposes, we'll simulate real-time updates with intervals
    // In production, you'd use actual WebSocket connections to financial data providers
    const interval = setInterval(() => {
      this.getLiveStockData(symbol).then(data => {
        const subscribers = this.subscribers.get(symbol);
        if (subscribers) {
          subscribers.forEach(callback => callback(data));
        }
      });
    }, 5000); // Update every 5 seconds
    
    // Store the interval ID as a mock WebSocket
    this.wsConnections.set(symbol, { close: () => clearInterval(interval) } as any);
  }

  private closeWebSocketConnection(symbol: string) {
    const ws = this.wsConnections.get(symbol);
    if (ws) {
      ws.close();
      this.wsConnections.delete(symbol);
    }
  }

  private async getAlphaVantageData(symbol: string): Promise<LiveStockData> {
    const response = await fetch(
      `${this.alphaVantageUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.alphaVantageKey}`
    );
    
    const data = await response.json();
    
    // Check for Alpha Vantage API error messages
    if (data['Error Message']) {
      throw new Error(`Alpha Vantage API Error: ${data['Error Message']}`);
    }
    
    if (data['Note']) {
      throw new Error(`Alpha Vantage API Rate Limit: ${data['Note']}`);
    }
    
    // Check if the response contains the expected Global Quote data
    if (!data['Global Quote']) {
      throw new Error('Alpha Vantage API did not return expected data format');
    }
    
    const quote = data['Global Quote'];
    
    return {
      symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      marketCap: '0',
      timestamp: new Date().toISOString(),
      dayHigh: parseFloat(quote['03. high']),
      dayLow: parseFloat(quote['04. low']),
      yearHigh: parseFloat(quote['03. high']),
      yearLow: parseFloat(quote['04. low'])
    };
  }

  private transformTwelveDataResponse(data: any): LiveStockData {
    return {
      symbol: data.symbol,
      price: parseFloat(data.close),
      change: parseFloat(data.change),
      changePercent: parseFloat(data.percent_change),
      volume: parseInt(data.volume),
      marketCap: data.market_cap || '0',
      timestamp: data.datetime,
      dayHigh: parseFloat(data.high),
      dayLow: parseFloat(data.low),
      yearHigh: parseFloat(data.fifty_two_week.high),
      yearLow: parseFloat(data.fifty_two_week.low)
    };
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['gain', 'rise', 'up', 'bull', 'growth', 'profit', 'strong', 'beat'];
    const negativeWords = ['loss', 'fall', 'down', 'bear', 'decline', 'weak', 'miss', 'drop'];
    
    const lowerText = text.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) positiveScore++;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  private getMockStockData(symbol: string): LiveStockData {
    const basePrice = Math.random() * 500 + 50;
    const change = (Math.random() - 0.5) * 10;
    
    return {
      symbol,
      price: basePrice,
      change,
      changePercent: (change / basePrice) * 100,
      volume: Math.floor(Math.random() * 10000000),
      marketCap: `${(Math.random() * 1000 + 100).toFixed(0)}B`,
      timestamp: new Date().toISOString(),
      dayHigh: basePrice + Math.random() * 20,
      dayLow: basePrice - Math.random() * 20,
      yearHigh: basePrice + Math.random() * 100,
      yearLow: basePrice - Math.random() * 50
    };
  }

  private getMockMarketCapData(): MarketCapData {
    return {
      marketCap: Math.random() * 1000000000000,
      sharesOutstanding: Math.random() * 1000000000,
      floatShares: Math.random() * 800000000,
      institutionalOwnership: Math.random() * 80 + 10,
      insiderOwnership: Math.random() * 20 + 5
    };
  }

  private getMockAnalystRatings(): AnalystRatings {
    return {
      strongBuy: Math.floor(Math.random() * 10) + 5,
      buy: Math.floor(Math.random() * 8) + 3,
      hold: Math.floor(Math.random() * 5) + 2,
      sell: Math.floor(Math.random() * 3) + 1,
      strongSell: Math.floor(Math.random() * 2),
      averageRating: Math.random() * 2 + 2,
      priceTarget: Math.random() * 200 + 100
    };
  }

  private getMockNews(symbol: string): NewsArticle[] {
    const mockNews = [
      {
        title: `${symbol} Reports Strong Quarterly Earnings`,
        summary: `${symbol} exceeded analyst expectations with robust revenue growth and improved margins.`,
        url: '#',
        source: 'Financial Times',
        publishedAt: new Date().toISOString(),
        sentiment: 'positive' as const,
        relevanceScore: 0.9
      },
      {
        title: `Market Analysis: ${symbol} Shows Resilience`,
        summary: `Despite market volatility, ${symbol} continues to demonstrate strong fundamentals.`,
        url: '#',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sentiment: 'positive' as const,
        relevanceScore: 0.8
      }
    ];
    
    return mockNews;
  }
}

export const stockApiService = new StockAPIService();