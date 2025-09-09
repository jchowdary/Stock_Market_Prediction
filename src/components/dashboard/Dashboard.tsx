import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import HomePage from './HomePage';
import WatchlistPage from './WatchlistPage';
import PortfolioPage from './PortfolioPage';
import NewsPage from './NewsPage';
import StockDetailPage from './StockDetailPage';
import { useData } from '../../context/DataContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchStocks } = useData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setShowSearchResults(false);
      return;
    }

    const results = await searchStocks(query);
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  const handleStockSelect = (symbol: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/dashboard/stock/${symbol}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-indigo-300 rounded-full"></div>
        <div className="absolute top-40 right-32 w-48 h-48 border border-green-300 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-80 h-80 border border-slate-300 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 border border-blue-300 rounded-full"></div>
      </div>
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Show search bar on all pages except stock detail */}
        {!location.pathname.includes('/stock/') && (
          <SearchBar
            query={searchQuery}
            onSearch={handleSearch}
            results={searchResults}
            showResults={showSearchResults}
            onStockSelect={handleStockSelect}
            onClose={() => setShowSearchResults(false)}
          />
        )}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/stock/:symbol" element={<StockDetailPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;