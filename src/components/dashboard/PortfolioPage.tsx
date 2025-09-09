import React from 'react';
import { useData } from '../../context/DataContext';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const { stocks, portfolio, removeFromPortfolio } = useData();

  const portfolioStocks = portfolio.map(item => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    return stock ? { ...stock, portfolioData: item } : null;
  }).filter(Boolean);
  
  // Calculate portfolio metrics
  const totalValue = portfolioStocks.reduce((sum, stock) => {
    if (stock && stock.portfolioData) {
      return sum + (stock.price * stock.portfolioData.shares);
    }
    return sum;
  }, 0);
  
  const totalCost = portfolioStocks.reduce((sum, stock) => {
    if (stock && stock.portfolioData) {
      return sum + (stock.portfolioData.purchasePrice * stock.portfolioData.shares);
    }
    return sum;
  }, 0);
  
  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPercent = totalCost > 0 ? ((totalProfitLoss / totalCost) * 100) : 0;

  if (portfolioStocks.length === 0) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Portfolio</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your portfolio is empty. Buy stocks from the Home page to start investing.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Your Portfolio</h2>
        <div className="text-sm text-gray-600">
          {portfolioStocks.length} positions
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-800">${totalValue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total P&L</p>
              <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(2)}
              </p>
              <p className={`text-sm ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ({totalProfitLoss >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%)
              </p>
            </div>
            {totalProfitLoss >= 0 ? 
              <TrendingUp className="w-8 h-8 text-green-500" /> : 
              <TrendingDown className="w-8 h-8 text-red-500" />
            }
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Positions</p>
              <p className="text-2xl font-bold text-gray-800">{portfolioStocks.length}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">#</span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Holdings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit / Loss</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolioStocks.map((stock) => {
                if (!stock || !stock.portfolioData) return null;
                
                const { shares, purchasePrice, purchaseDate } = stock.portfolioData;
                const currentValue = stock.price * shares;
                const totalCost = purchasePrice * shares;
                const profitLoss = currentValue - totalCost;
                const profitLossPercent = ((profitLoss / totalCost) * 100);
                const profitLossColor = profitLoss >= 0 ? "text-green-600" : "text-red-600";

                return (
                  <tr key={stock.symbol} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                          <div className="text-sm text-gray-500">{stock.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${purchasePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${currentValue.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${profitLossColor}`}>
                      {profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)}
                      <div className="text-xs">
                        ({profitLoss >= 0 ? "+" : ""}{profitLossPercent.toFixed(2)}%)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={() => removeFromPortfolio(stock.symbol)}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;