import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  sentiment?: 'bullish' | 'bearish' | 'neutral';
  avatar?: string;
}

interface LiveChatProps {
  symbol: string;
  currentPrice: number;
  priceChange: number;
}

const LiveChat: React.FC<LiveChatProps> = ({ symbol, currentPrice, priceChange }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(12);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with some mock messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        user: 'TraderMike',
        message: `${symbol} looking strong today! Great volume.`,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        sentiment: 'bullish'
      },
      {
        id: '2',
        user: 'InvestorSarah',
        message: 'Anyone else seeing the resistance at $' + currentPrice.toFixed(2) + '?',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        sentiment: 'neutral'
      },
      {
        id: '3',
        user: 'ChartAnalyst',
        message: 'RSI is showing overbought conditions. Might see a pullback.',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        sentiment: 'bearish'
      }
    ];
    
    setMessages(mockMessages);
    
    // Simulate new messages periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        addRandomMessage();
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [symbol, currentPrice]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addRandomMessage = () => {
    const randomUsers = ['BullRunner', 'ValueSeeker', 'DayTrader99', 'LongTermInvestor', 'TechAnalyst'];
    const randomMessages = [
      `${symbol} breaking out! 🚀`,
      'Volume is picking up nicely',
      'Support holding strong at this level',
      'Earnings report next week should be interesting',
      'Chart pattern looking bullish',
      'Taking some profits here',
      'Adding to my position on this dip',
      'News catalyst driving this move?'
    ];
    
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: randomUsers[Math.floor(Math.random() * randomUsers.length)],
      message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
      timestamp: new Date(),
      sentiment: Math.random() > 0.5 ? 'bullish' : Math.random() > 0.5 ? 'bearish' : 'neutral'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setOnlineUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      user: user.name,
      message: newMessage.trim(),
      timestamp: new Date(),
      sentiment: analyzeSentiment(newMessage)
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const analyzeSentiment = (text: string): 'bullish' | 'bearish' | 'neutral' => {
    const bullishWords = ['buy', 'bull', 'up', 'rise', 'gain', 'strong', 'breakout', 'moon', '🚀'];
    const bearishWords = ['sell', 'bear', 'down', 'fall', 'drop', 'weak', 'crash', 'dump'];
    
    const lowerText = text.toLowerCase();
    const bullishCount = bullishWords.filter(word => lowerText.includes(word)).length;
    const bearishCount = bearishWords.filter(word => lowerText.includes(word)).length;
    
    if (bullishCount > bearishCount) return 'bullish';
    if (bearishCount > bullishCount) return 'bearish';
    return 'neutral';
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {onlineUsers}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{symbol} Live Chat</h3>
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <Users className="w-4 h-4" />
              <span>{onlineUsers} online</span>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            ×
          </button>
        </div>
      </div>

      {/* Price Ticker */}
      <div className="bg-gray-50 px-4 py-2 border-b">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold">${currentPrice.toFixed(2)}</span>
          <span className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-600">{message.user}</span>
              {getSentimentIcon(message.sentiment)}
              <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
            </div>
            <div className={`text-sm p-2 rounded-lg max-w-xs ${
              message.user === user?.name 
                ? 'bg-blue-500 text-white ml-auto' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {message.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;