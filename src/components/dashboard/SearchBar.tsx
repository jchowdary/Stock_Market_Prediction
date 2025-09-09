import React from 'react';
import { Search } from 'lucide-react';
import { Stock } from '../../types/stock';

interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
  results: Stock[];
  showResults: boolean;
  onStockSelect: (symbol: string) => void;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onSearch,
  results,
  showResults,
  onStockSelect,
  onClose
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-slate-200/50">
      <h2 className="text-xl font-semibold mb-6 text-slate-800 flex items-center">
        <Search className="w-5 h-5 mr-2 text-indigo-600" />
        Stock Search
      </h2>
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300 bg-slate-50/50 hover:bg-white text-lg"
            placeholder="Search for a stock (e.g., AAPL, TSLA, Microsoft)"
          />
          <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
        </div>
        
        {/* Search Results Dropdown */}
        {showResults && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={onClose}
            />
            <div className="absolute z-20 w-full mt-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No stocks found</div>
              ) : (
                results.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => onStockSelect(stock.symbol)}
                    className="p-4 hover:bg-indigo-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-slate-800">{stock.symbol}</div>
                        <div className="text-sm text-slate-600">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${stock.price}</div>
                        <div className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar;