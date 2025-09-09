import React from 'react';
import StockCard from './StockCard';
import { Stock } from '../../types/stock';

interface StockGridProps {
  stocks: Stock[];
  emptyMessage?: string;
}

const StockGrid: React.FC<StockGridProps> = ({ 
  stocks, 
  emptyMessage = "No stocks to display" 
}) => {
  if (stocks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stocks.map((stock) => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
    </div>
  );
};

export default StockGrid;