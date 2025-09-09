import React from 'react';
import StockGrid from './StockGrid';
import { useData } from '../../context/DataContext';

const HomePage: React.FC = () => {
  const { stocks } = useData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Popular Stocks</h2>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      <StockGrid stocks={stocks} />
    </div>
  );
};

export default HomePage;