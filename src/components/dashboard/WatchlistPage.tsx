import React from 'react';
import StockGrid from './StockGrid';
import { useData } from '../../context/DataContext';

const WatchlistPage: React.FC = () => {
  const { stocks, watchlist } = useData();

  const watchlistStocks = stocks.filter(stock => watchlist.includes(stock.symbol));
  
  // Add some additional stocks to make the watchlist more comprehensive
  const additionalStocks = stocks.filter(stock => !watchlist.includes(stock.symbol)).slice(0, 5);
  const allDisplayStocks = [...watchlistStocks, ...additionalStocks];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Your Watchlist</h2>
        <div className="text-sm text-gray-600">
          {watchlistStocks.length} watched • {allDisplayStocks.length} total stocks
        </div>
      </div>
      
      {watchlistStocks.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Watched Stocks</h3>
          <StockGrid 
            stocks={watchlistStocks} 
            emptyMessage="Your watchlist is empty. Add stocks from the Home page to track them here."
          />
        </>
      )}
      
      {additionalStocks.length > 0 && (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 mt-8">Suggested Stocks</h3>
          <StockGrid 
            stocks={additionalStocks} 
            emptyMessage=""
          />
        </>
      )}
      
      {watchlistStocks.length === 0 && additionalStocks.length === 0 && (
      <StockGrid 
        stocks={allDisplayStocks} 
        emptyMessage="Your watchlist is empty. Add stocks from the Home page to track them here."
      />
      )}
    </div>
  );
};

export default WatchlistPage;