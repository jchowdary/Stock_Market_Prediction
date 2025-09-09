// Mock API functions for stock market data
// In production, these would connect to real APIs like Alpha Vantage, Yahoo Finance, etc.

export interface StockApiResponse {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  timestamp: string;
}

export interface NewsApiResponse {
  articles: Array<{
    title: string;
    source: string;
    publishedAt: string;
    content: string;
    sentiment: string;
    relevantSymbols: string[];
  }>;
}

export class StockAPI {
  private baseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

  async getStockData(symbol: string): Promise<StockApiResponse> {
    // Mock implementation - replace with real API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          symbol,
          price: Math.random() * 500 + 50,
          change: (Math.random() - 0.5) * 10,
          volume: Math.floor(Math.random() * 10000000),
          timestamp: new Date().toISOString()
        });
      }, 500);
    });
  }

  async getMultipleStocks(symbols: string[]): Promise<StockApiResponse[]> {
    // In production: fetch(`${this.baseUrl}/api/stocks/batch`, { ... })
    const promises = symbols.map(symbol => this.getStockData(symbol));
    return Promise.all(promises);
  }

  async getStockNews(symbol?: string): Promise<NewsApiResponse> {
    // In production: fetch(`${this.baseUrl}/api/news${symbol ? `?symbol=${symbol}` : ''}`)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          articles: [] // Would contain real news data
        });
      }, 500);
    });
  }

  async getMarketSentiment(): Promise<{ sentiment: string; confidence: number }> {
    // In production: fetch(`${this.baseUrl}/api/sentiment`)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          sentiment: 'bullish',
          confidence: 0.75
        });
      }, 500);
    });
  }

  async getPrediction(symbol: string, timeframe: string): Promise<{ prediction: number; confidence: number }> {
    // In production: fetch(`${this.baseUrl}/api/predict/${symbol}?timeframe=${timeframe}`)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          prediction: Math.random() * 10 - 5, // -5% to +5%
          confidence: Math.random() * 0.5 + 0.5 // 50% to 100%
        });
      }, 1000);
    });
  }
}

export const stockApi = new StockAPI();