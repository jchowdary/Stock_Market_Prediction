import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Eye, ShoppingCart, Activity, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StockChart from './StockChart';
import NewsCard from './NewsCard';
import LiveChat from './LiveChat';
import MarketCapWidget from './MarketCapWidget';
import { stockApiService } from '../../services/stockApi';
import type { LiveStockData, MarketCapData, AnalystRatings } from '../../services/stockApi';

const StockDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { stocks, news, watchlist, portfolio, addToWatchlist, removeFromWatchlist, addToPortfolio, removeFromPortfolio, getStockNews } = useData();
  
  const [selectedTimeframe, setSelectedTimeframe] = useState('1W');
  const [stockNews, setStockNews] = useState<any[]>([]);
  const [loadingStockNews, setLoadingStockNews] = useState(false);
  const [liveData, setLiveData] = useState<LiveStockData | null>(null);
  const [marketCapData, setMarketCapData] = useState<MarketCapData | null>(null);
  const [analystRatings, setAnalystRatings] = useState<AnalystRatings | null>(null);
  const [loadingLiveData, setLoadingLiveData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  const stock = stocks.find(s => s.symbol === symbol);
  
  const isInWatchlist = symbol ? watchlist.includes(symbol) : false;
  const isInPortfolio = symbol ? portfolio.includes(symbol) : false;

  useEffect(() => {
    if (symbol) {
      loadStockNews(symbol);
      loadLiveData(symbol);
      loadMarketData(symbol);
      
      // Set up real-time updates
      const unsubscribe = stockApiService.subscribeToRealTimeUpdates(symbol, handleLiveDataUpdate);
      return unsubscribe;
    }
  }, [symbol]);

  if (!stock) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Stock not found</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const loadStockNews = async (stockSymbol: string) => {
    setLoadingStockNews(true);
    try {
      const articles = await stockApiService.getStockNews(stockSymbol);
      setStockNews(articles);
    } catch (error) {
      console.error('Failed to load stock news:', error);
      setStockNews(news.filter(n => n.stock === stockSymbol));
    } finally {
      setLoadingStockNews(false);
    }
  };

  const loadLiveData = async (stockSymbol: string) => {
    setLoadingLiveData(true);
    try {
      const data = await stockApiService.getLiveStockData(stockSymbol);
      setLiveData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load live data:', error);
    } finally {
      setLoadingLiveData(false);
    }
  };

  const loadMarketData = async (stockSymbol: string) => {
    try {
      const [marketCap, ratings] = await Promise.all([
        stockApiService.getMarketCapData(stockSymbol),
        stockApiService.getAnalystRatings(stockSymbol)
      ]);
      setMarketCapData(marketCap);
      setAnalystRatings(ratings);
    } catch (error) {
      console.error('Failed to load market data:', error);
    }
  };

  const handleLiveDataUpdate = (data: LiveStockData) => {
    setLiveData(data);
    setLastUpdated(new Date());
  };

  const handleRefreshData = () => {
    if (symbol) {
      loadLiveData(symbol);
      loadStockNews(symbol);
      loadMarketData(symbol);
    }
  };

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      removeFromWatchlist(stock.symbol);
    } else {
      addToWatchlist(stock.symbol);
    }
  };

  const handlePortfolioToggle = () => {
    if (isInPortfolio) {
      removeFromPortfolio(stock.symbol);
    } else {
      addToPortfolio(stock.symbol);
    }
  };

  // Use live data if available, otherwise fall back to mock data
  const displayPrice = liveData?.price || stock.price;
  const displayChange = liveData?.changePercent || stock.change;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Stock Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{stock.name} ({stock.symbol})</h1>
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-4xl font-bold text-gray-800">${displayPrice.toFixed(2)}</span>
              <div className={`flex items-center space-x-1 ${displayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {displayChange >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                <span className="text-xl font-semibold">{displayChange >= 0 ? '+' : ''}{displayChange.toFixed(2)}%</span>
              </div>
              {liveData && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{stock.exchange} • {stock.sector}</span>
              <span>•</span>
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              stock.recommendation === 'STRONG BUY' || stock.recommendation === 'BUY' 
                ? 'bg-green-100 text-green-800' 
                : stock.recommendation === 'HOLD' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {stock.recommendation}
            </span>
            
            <button
              onClick={handleRefreshData}
              disabled={loadingLiveData}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingLiveData ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={handleWatchlistToggle}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isInWatchlist
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <Eye className="w-5 h-5" />
            <span>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
          </button>
          
          <button
            onClick={handlePortfolioToggle}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isInPortfolio
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{isInPortfolio ? 'Sell Stock' : 'Buy Stock'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Chart and Metrics */}
        <div className="xl:col-span-2 space-y-6">
          {/* Price Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <Activity className="w-6 h-6" />
                <span>Price Chart</span>
              </h2>
              <div className="flex space-x-2">
                {timeframes.map(timeframe => (
                  <button
                    key={timeframe}
                    onClick={() => setSelectedTimeframe(timeframe)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeframe === timeframe
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {timeframe}
                  </button>
                ))}
              </div>
            </div>
            <StockChart stock={{ ...stock, price: displayPrice, change: displayChange }} timeframe={selectedTimeframe} />
          </div>

          {/* Analysis & Recommendation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis & Recommendation</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Valuation</p>
                  <p className="text-gray-800">{stock.valuation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Timeframe</p>
                  <p className="text-gray-800">{stock.timeframe}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Risk Level</p>
                  <p className="text-gray-800">{stock.risk}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Key Metrics and Market Data */}
        <div className="space-y-6">
          {/* Live Price Widget */}
          {liveData && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Live Market Data</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="opacity-80">Volume</div>
                  <div className="font-semibold">{liveData.volume.toLocaleString()}</div>
                </div>
                <div>
                  <div className="opacity-80">Day High</div>
                  <div className="font-semibold">${liveData.dayHigh.toFixed(2)}</div>
                </div>
                <div>
                  <div className="opacity-80">Day Low</div>
                  <div className="font-semibold">${liveData.dayLow.toFixed(2)}</div>
                </div>
                <div>
                  <div className="opacity-80">52W High</div>
                  <div className="font-semibold">${liveData.yearHigh.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">P/E Ratio</span>
                <span className="font-semibold text-gray-800">{stock.pe}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Market Cap</span>
                <span className="font-semibold text-gray-800">${stock.marketCap}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Dividend Yield</span>
                <span className="font-semibold text-gray-800">{stock.dividend}%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">52W High</span>
                <span className="font-semibold text-gray-800">${stock.high}</span>
              </div>
            </div>
          </div>

          {/* Market Cap and Analyst Data */}
          {marketCapData && analystRatings && (
            <MarketCapWidget
              symbol={stock.symbol}
              marketCapData={marketCapData}
              analystRatings={analystRatings}
            />
          )}

          {/* Recent News */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent News & Sentiment</h3>
            <div className="space-y-4">
              {loadingStockNews && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center space-x-2 text-blue-600">
                    <span>Loading news for {stock.symbol}...</span>
                  </div>
                </div>
              )}
              {stockNews.length === 0 ? (
                <p className="text-center text-gray-500">No recent news for this stock.</p>
              ) : (
                stockNews.map((article, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="text-sm">
                      <h4 className="font-medium text-gray-800 mb-1">{article.title}</h4>
                      <p className="text-gray-600 text-xs mb-2">{article.summary}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{article.source}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          article.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          article.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {article.sentiment}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Component */}
      <LiveChat
        symbol={stock.symbol}
        currentPrice={displayPrice}
        priceChange={displayChange}
      />
    </div>
  );
};

export default StockDetailPage;