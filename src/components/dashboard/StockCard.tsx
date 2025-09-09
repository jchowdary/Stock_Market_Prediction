import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Eye, ShoppingCart } from 'lucide-react';
import { Stock } from '../../types/stock';
import { useData } from '../../context/DataContext';

interface StockCardProps {
  stock: Stock;
  showActions?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ stock, showActions = true }) => {
  const navigate = useNavigate();
  const { addToWatchlist, addToPortfolio, watchlist, portfolio } = useData();

  const isInWatchlist = watchlist.includes(stock.symbol);
  const isInPortfolio = portfolio.includes(stock.symbol);

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'STRONG BUY':
      case 'BUY':
        return 'bg-green-100 text-green-800';
      case 'HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'SELL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-slate-200/50 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{stock.symbol}</h3>
          <p className="text-sm text-slate-600 truncate">{stock.name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRecommendationColor(stock.recommendation)}`}>
          {stock.recommendation}
        </span>
      </div>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-slate-800">${stock.price}</span>
          <div className={`flex items-center space-x-1 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
          </div>
        </div>
        <p className="text-sm text-slate-500">{stock.exchange} • {stock.sector}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div className="bg-slate-50 p-3 rounded-xl">
          <span className="text-slate-500">P/E</span>
          <div className="font-semibold">{stock.pe}</div>
        </div>
        <div className="bg-slate-50 p-3 rounded-xl">
          <span className="text-slate-500">Cap</span>
          <div className="font-semibold">{stock.marketCap}</div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2">
          <button
            onClick={() => addToWatchlist(stock.symbol)}
            disabled={isInWatchlist}
            className={`flex-1 flex items-center justify-center space-x-1 py-3 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              isInWatchlist
                ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:shadow-md'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{isInWatchlist ? 'Watching' : 'Watch'}</span>
          </button>
          
          <button
            onClick={() => addToPortfolio(stock.symbol)}
            disabled={isInPortfolio}
            className={`flex-1 flex items-center justify-center space-x-1 py-3 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              isInPortfolio
                ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                : 'bg-green-100 text-green-700 hover:bg-green-200 hover:shadow-md'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isInPortfolio ? 'Owned' : 'Buy'}</span>
          </button>
        </div>
      )}

      {/* View Details Button */}
      <button
        onClick={() => navigate(`/dashboard/stock/${stock.symbol}`)}
        className="w-full mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors hover:underline"
      >
        View Details →
      </button>
    </div>
  );
};

export default StockCard;