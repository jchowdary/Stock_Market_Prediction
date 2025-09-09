import React, { createContext, useContext, useState, useEffect } from 'react';
import { Stock } from '../types/stock';
import { NewsArticle } from '../types/news';
import { mockStocks, mockNews } from '../data/mockData';
import { newsService } from '../services/newsService';

interface DataContextType {
  stocks: Stock[];
  news: NewsArticle[];
  realNews: NewsArticle[];
  loadingNews: boolean;
  watchlist: string[];
  portfolio: PortfolioItem[];
  searchStocks: (query: string) => Promise<Stock[]>;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  addToPortfolio: (symbol: string) => void;
  removeFromPortfolio: (symbol: string) => void;
  refreshNews: () => Promise<void>;
  getStockNews: (symbol: string) => Promise<NewsArticle[]>;
}

interface PortfolioItem {
  symbol: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
  id: string;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks] = useState<Stock[]>(mockStocks);
  const [news] = useState<NewsArticle[]>(mockNews);
  const [realNews, setRealNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    // Load user data from localStorage
    const savedWatchlist = localStorage.getItem('stockwise-watchlist');
    const savedPortfolio = localStorage.getItem('stockwise-portfolio');
    
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
    
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }

    // Load real news on app start
    refreshNews();
  }, []);

  const saveWatchlist = (newWatchlist: string[]) => {
    setWatchlist(newWatchlist);
    localStorage.setItem('stockwise-watchlist', JSON.stringify(newWatchlist));
  };

  const savePortfolio = (newPortfolio: PortfolioItem[]) => {
    setPortfolio(newPortfolio);
    localStorage.setItem('stockwise-portfolio', JSON.stringify(newPortfolio));
  };

  const searchStocks = async (query: string): Promise<Stock[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const searchTerm = query.toUpperCase();
    return stocks.filter(stock => 
      stock.symbol.includes(searchTerm) || 
      stock.name.toUpperCase().includes(searchTerm)
    ).slice(0, 8); // Limit results
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      const newWatchlist = [...watchlist, symbol];
      saveWatchlist(newWatchlist);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    const newWatchlist = watchlist.filter(s => s !== symbol);
    saveWatchlist(newWatchlist);
  };

  const addToPortfolio = (symbol: string) => {
    const existingItem = portfolio.find(item => item.symbol === symbol);
    if (!existingItem) {
      const stock = stocks.find(s => s.symbol === symbol);
      if (stock) {
        const newItem: PortfolioItem = {
          id: `${symbol}-${Date.now()}`,
          symbol,
          shares: 10, // Default 10 shares
          purchasePrice: stock.price,
          purchaseDate: new Date().toISOString().split('T')[0]
        };
        const newPortfolio = [...portfolio, newItem];
        savePortfolio(newPortfolio);
      }
    } else {
      // Add more shares to existing position
      const stock = stocks.find(s => s.symbol === symbol);
      if (stock) {
        const updatedPortfolio = portfolio.map(item => {
          if (item.symbol === symbol) {
            const totalValue = (item.shares * item.purchasePrice) + (10 * stock.price);
            const totalShares = item.shares + 10;
            return {
              ...item,
              shares: totalShares,
              purchasePrice: totalValue / totalShares // Average price
            };
          }
          return item;
        });
      savePortfolio(updatedPortfolio);
      }
    }
  };
  const removeFromPortfolio = (symbol: string) => {
    const newPortfolio = portfolio.filter(item => item.symbol !== symbol);
    savePortfolio(newPortfolio);
  };

  const refreshNews = async (): Promise<void> => {
    setLoadingNews(true);
    try {
      const articles = await newsService.getFinancialNews();
      const transformedNews = newsService.transformToAppNews(articles);
      setRealNews(transformedNews);
    } catch (error) {
      console.error('Failed to fetch real news:', error);
      // Keep existing mock news as fallback
    } finally {
      setLoadingNews(false);
    }
  };

  const getStockNews = async (symbol: string): Promise<NewsArticle[]> => {
    try {
      const articles = await newsService.getStockSpecificNews(symbol);
      return newsService.transformToAppNews(articles);
    } catch (error) {
      console.error(`Failed to fetch news for ${symbol}:`, error);
      // Return mock news filtered by symbol as fallback
      return news.filter(article => article.stock === symbol);
    }
  };

  const value: DataContextType = {
    stocks,
    news,
    realNews,
    loadingNews,
    watchlist,
    portfolio,
    searchStocks,
    addToWatchlist,
    removeFromWatchlist,
    addToPortfolio,
    removeFromPortfolio,
    refreshNews,
    getStockNews
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};