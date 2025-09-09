import React from 'react';
import { TrendingUp, Users, PieChart, BarChart3 } from 'lucide-react';

interface MarketCapData {
  marketCap: number;
  sharesOutstanding: number;
  floatShares: number;
  institutionalOwnership: number;
  insiderOwnership: number;
}

interface AnalystRatings {
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
  averageRating: number;
  priceTarget: number;
}

interface MarketCapWidgetProps {
  symbol: string;
  marketCapData: MarketCapData;
  analystRatings: AnalystRatings;
}

const MarketCapWidget: React.FC<MarketCapWidgetProps> = ({
  symbol,
  marketCapData,
  analystRatings
}) => {
  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const formatShares = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    return `${value.toFixed(2)}`;
  };

  const totalRatings = analystRatings.strongBuy + analystRatings.buy + 
                     analystRatings.hold + analystRatings.sell + analystRatings.strongSell;

  const getRatingPercentage = (count: number) => (count / totalRatings) * 100;

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'strongBuy': return 'bg-green-600';
      case 'buy': return 'bg-green-400';
      case 'hold': return 'bg-yellow-400';
      case 'sell': return 'bg-red-400';
      case 'strongSell': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  const getAverageRatingText = (rating: number) => {
    if (rating <= 1.5) return 'Strong Buy';
    if (rating <= 2.5) return 'Buy';
    if (rating <= 3.5) return 'Hold';
    if (rating <= 4.5) return 'Sell';
    return 'Strong Sell';
  };

  return (
    <div className="space-y-6">
      {/* Market Cap Information */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Market Capitalization
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Market Cap</span>
              <span className="font-semibold text-gray-800">
                {formatMarketCap(marketCapData.marketCap)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Shares Outstanding</span>
              <span className="font-semibold text-gray-800">
                {formatShares(marketCapData.sharesOutstanding)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Float Shares</span>
              <span className="font-semibold text-gray-800">
                {formatShares(marketCapData.floatShares)}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Institutional Ownership</span>
              <span className="font-semibold text-gray-800">
                {marketCapData.institutionalOwnership.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Insider Ownership</span>
              <span className="font-semibold text-gray-800">
                {marketCapData.insiderOwnership.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analyst Ratings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
          Analyst Ratings
        </h3>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Average Rating</span>
            <div className="text-right">
              <span className="font-semibold text-gray-800">
                {getAverageRatingText(analystRatings.averageRating)}
              </span>
              <div className="text-sm text-gray-500">
                ({analystRatings.averageRating.toFixed(1)}/5.0)
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Price Target</span>
            <span className="font-semibold text-gray-800">
              ${analystRatings.priceTarget.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 flex items-center">
            <PieChart className="w-4 h-4 mr-2" />
            Rating Distribution ({totalRatings} analysts)
          </h4>
          
          {[
            { key: 'strongBuy', label: 'Strong Buy', count: analystRatings.strongBuy },
            { key: 'buy', label: 'Buy', count: analystRatings.buy },
            { key: 'hold', label: 'Hold', count: analystRatings.hold },
            { key: 'sell', label: 'Sell', count: analystRatings.sell },
            { key: 'strongSell', label: 'Strong Sell', count: analystRatings.strongSell }
          ].map(({ key, label, count }) => (
            <div key={key} className="flex items-center space-x-3">
              <div className="w-20 text-sm text-gray-600">{label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className={`h-4 rounded-full ${getRatingColor(key)} transition-all duration-500`}
                  style={{ width: `${getRatingPercentage(count)}%` }}
                />
              </div>
              <div className="w-12 text-sm font-medium text-gray-700 text-right">
                {count}
              </div>
              <div className="w-12 text-xs text-gray-500 text-right">
                {getRatingPercentage(count).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ownership Breakdown */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-purple-600" />
          Ownership Breakdown
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Institutional</span>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${marketCapData.institutionalOwnership}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {marketCapData.institutionalOwnership.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Insider</span>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${marketCapData.insiderOwnership}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {marketCapData.insiderOwnership.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Public</span>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${100 - marketCapData.institutionalOwnership - marketCapData.insiderOwnership}%` 
                  }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {(100 - marketCapData.institutionalOwnership - marketCapData.insiderOwnership).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketCapWidget;