import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, TrendingUp, Clock, Filter } from 'lucide-react';
import NewsCard from './NewsCard';
import { useData } from '../../context/DataContext';
import { NewsArticle } from '../../types/news';
import { stockApiService } from '../../services/stockApi';

const NewsPage: React.FC = () => {
  const { news, realNews, stocks, loadingNews, refreshNews, watchlist } = useData();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showStockDetail, setShowStockDetail] = useState(false);
  const [showRealNews, setShowRealNews] = useState(true);
  const [selectedStock, setSelectedStock] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [liveNewsData, setLiveNewsData] = useState<any[]>([]);
  const [loadingLiveNews, setLoadingLiveNews] = useState(false);

  const handleReadMore = (article: NewsArticle) => {
    setSelectedArticle(article);
    setShowStockDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedArticle(null);
    setShowStockDetail(false);
  };

  const handleRefreshNews = async () => {
    await refreshNews();
    if (selectedStock !== 'all') {
      await loadStockSpecificNews(selectedStock);
    }
  };

  const loadStockSpecificNews = async (symbol: string) => {
    setLoadingLiveNews(true);
    try {
      const articles = await stockApiService.getStockNews(symbol, 20);
      setLiveNewsData(articles);
    } catch (error) {
      console.error('Failed to load stock-specific news:', error);
    } finally {
      setLoadingLiveNews(false);
    }
  };

  const handleStockFilter = async (symbol: string) => {
    setSelectedStock(symbol);
    if (symbol !== 'all') {
      await loadStockSpecificNews(symbol);
    } else {
      setLiveNewsData([]);
    }
  };

  // Combine real news and mock news, prioritizing real news
  let displayNews = showRealNews && realNews.length > 0 ? realNews : news;
  
  // Apply stock filter
  if (selectedStock !== 'all') {
    displayNews = liveNewsData.length > 0 ? liveNewsData : displayNews.filter(article => article.stock === selectedStock);
  }
  
  // Apply sentiment filter
  if (sentimentFilter !== 'all') {
    displayNews = displayNews.filter(article => article.sentiment === sentimentFilter);
  }

  if (showStockDetail && selectedArticle) {
    const relatedStock = stocks.find(s => s.symbol === selectedArticle.stock);
    
    return (
      <div>
        <button
          onClick={handleCloseDetail}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to News</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{selectedArticle.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <span>{selectedArticle.source}</span>
              <span>•</span>
              <span>{selectedArticle.time}</span>
              <span>•</span>
              <span className="font-medium text-blue-600">{selectedArticle.stock}</span>
              {selectedArticle.url && selectedArticle.url !== '#' && (
                <>
                  <span>•</span>
                  <a 
                    href={selectedArticle.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Read Full Article
                  </a>
                </>
              )}
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">{selectedArticle.content}</p>
              <p className="text-gray-700 leading-relaxed mb-4">
                This news article has been analyzed using AI sentiment analysis and shows a <strong>{selectedArticle.sentiment}</strong> sentiment 
                towards {selectedArticle.stock}. Market sentiment analysis helps investors understand the potential impact of news on stock prices.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Based on our AI analysis, this news could potentially affect the stock's short-term performance. 
                {selectedArticle.sentiment === 'bullish' 
                  ? ' Positive sentiment typically correlates with upward price movement.' 
                  : selectedArticle.sentiment === 'bearish'
                  ? ' Negative sentiment may lead to downward pressure on the stock price.'
                  : ' Neutral sentiment suggests minimal immediate impact on stock price.'}
              </p>
            </div>
          </div>
        </div>

        {relatedStock && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Stock Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{relatedStock.name} ({relatedStock.symbol})</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Price:</span>
                    <span className="font-semibold">${relatedStock.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Change:</span>
                    <span className={`font-semibold ${relatedStock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {relatedStock.change >= 0 ? '+' : ''}{relatedStock.change}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Cap:</span>
                    <span className="font-semibold">${relatedStock.marketCap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">P/E Ratio:</span>
                    <span className="font-semibold">{relatedStock.pe}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-2">AI Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recommendation:</span>
                    <span className={`font-semibold px-2 py-1 rounded text-xs ${
                      relatedStock.recommendation === 'STRONG BUY' || relatedStock.recommendation === 'BUY' 
                        ? 'bg-green-100 text-green-800' 
                        : relatedStock.recommendation === 'HOLD' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {relatedStock.recommendation}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Valuation:</strong> {relatedStock.valuation}</p>
                    <p><strong>Risk Level:</strong> {relatedStock.risk}</p>
                    <p><strong>Timeframe:</strong> {relatedStock.timeframe}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Latest Stock News</h2>
          <div className="flex items-center space-x-4 mt-2">
            <button
              onClick={() => setShowRealNews(true)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                showRealNews ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Live News
            </button>
            <button
              onClick={() => setShowRealNews(false)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                !showRealNews ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sample News
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          {/* Stock Filter */}
          <select
            value={selectedStock}
            onChange={(e) => handleStockFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stocks</option>
            {watchlist.length > 0 && (
              <optgroup label="Your Watchlist">
                {watchlist.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </optgroup>
            )}
            <optgroup label="Popular Stocks">
              {stocks.slice(0, 10).map(stock => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name}
                </option>
              ))}
            </optgroup>
          </select>
          
          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sentiment</option>
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefreshNews}
            disabled={loadingNews}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingNews ? 'animate-spin' : ''}`} />
            <span>{loadingNews ? 'Loading...' : 'Refresh'}</span>
          </button>
          <div className="text-sm text-gray-600">
            {displayNews.length} articles
          </div>
        </div>
      </div>
      
      {(loadingNews || loadingLiveNews) && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>
              {loadingLiveNews ? `Loading ${selectedStock} news...` : 'Loading latest financial news...'}
            </span>
          </div>
        </div>
      )}
      
      {/* News Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-800">{displayNews.length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bullish News</p>
              <p className="text-2xl font-bold text-green-600">
                {displayNews.filter(n => n.sentiment === 'bullish').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bearish News</p>
              <p className="text-2xl font-bold text-red-600">
                {displayNews.filter(n => n.sentiment === 'bearish').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-500 transform rotate-180" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayNews.map((article, index) => (
          <NewsCard key={index} article={article} onReadMore={handleReadMore} />
        ))}
      </div>
      
      {displayNews.length === 0 && !loadingNews && !loadingLiveNews && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No news articles found for the selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedStock('all');
              setSentimentFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsPage;