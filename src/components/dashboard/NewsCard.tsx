import React from 'react';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { NewsArticle } from '../../types/news';

interface NewsCardProps {
  article: NewsArticle;
  onReadMore?: (article: NewsArticle) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onReadMore }) => {
  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return {
          bg: 'bg-green-50 border-l-green-400',
          text: 'text-green-600',
          icon: TrendingUp
        };
      case 'bearish':
        return {
          bg: 'bg-red-50 border-l-red-400',
          text: 'text-red-600',
          icon: TrendingDown
        };
      default:
        return {
          bg: 'bg-gray-50 border-l-gray-400',
          text: 'text-gray-600',
          icon: Clock
        };
    }
  };

  const sentimentStyle = getSentimentStyle(article.sentiment);
  const SentimentIcon = sentimentStyle.icon;

  return (
    <div className={`${sentimentStyle.bg} border-l-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 leading-tight">{article.title}</h3>
        <span className={`flex items-center space-x-1 ${sentimentStyle.text} text-xs px-2 py-1 rounded-full bg-white`}>
          <SentimentIcon className="w-3 h-3" />
          <span className="capitalize">{article.sentiment}</span>
        </span>
      </div>

      <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
        <span>{article.source}</span>
        <span>•</span>
        <span>{article.time}</span>
        <span>•</span>
        <span className="font-medium text-blue-600">{article.stock}</span>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-4">{article.content}</p>

      <div className="flex justify-between items-center">
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          onClick={() => onReadMore && onReadMore(article)}
        >
          Read More
        </button>
        <div className={`text-xs font-semibold ${sentimentStyle.text}`}>
          Sentiment: {article.sentiment.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;