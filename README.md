# StockWise - Smart Investment Platform

A modern, responsive stock market prediction and analysis web application built with React, TypeScript, and Tailwind CSS.

## Features

- **Authentication System**: Secure login and signup with form validation
- **Real-time Stock Dashboard**: Browse popular stocks with live pricing data
- **Personal Watchlist**: Track your favorite stocks
- **Portfolio Management**: Manage your stock investments
- **Financial News Feed**: Stay updated with market news and AI sentiment analysis
- **Stock Analysis**: Detailed stock information with charts and key metrics
- **AI-Powered Predictions**: Market trend analysis and recommendations
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Context API** for state management

### Backend Architecture (Ready for Integration)
The application is structured to easily integrate with a Python backend:

- **FastAPI/Flask** backend support
- **RESTful API** endpoints
- **WebSocket** support for real-time updates
- **PostgreSQL** database integration
- **AI/NLP** models for sentiment analysis

## Backend Integration Points

### API Endpoints Structure
```
/api/auth/login          - User authentication
/api/auth/signup         - User registration
/api/stocks/list         - Get stock listings
/api/stocks/{symbol}     - Get specific stock data
/api/news               - Get financial news
/api/sentiment          - Get market sentiment
/api/predict/{symbol}    - Get AI predictions
/api/watchlist          - Manage user watchlist
/api/portfolio          - Manage user portfolio
```

### Real-time Features
- WebSocket connections for live price updates
- Real-time news feed updates
- Live market sentiment tracking

### AI Integration
- Sentiment analysis on financial news
- Stock price prediction models
- Market trend analysis
- Personalized recommendations

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API Keys (Optional)**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys for real news data
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## API Configuration

### News API Setup
To get real financial news, you can configure the following APIs:

1. **NewsAPI** (Recommended)
   - Sign up at https://newsapi.org/
   - Add `VITE_NEWS_API_KEY=your_key` to your `.env` file
   - Provides comprehensive news coverage with 1000 free requests/day

2. **Alpha Vantage** (For stock-specific news)
   - Sign up at https://www.alphavantage.co/
   - Add `VITE_ALPHA_VANTAGE_KEY=your_key` to your `.env` file
   - Provides stock market data and news

3. **Fallback Sources**
   - The app automatically falls back to free news sources if API keys aren't configured
   - Uses Marketaux API demo and RSS feeds as backup

## Backend Setup (Python)

To integrate with the backend prediction system:

1. **Install Python Dependencies**
   ```bash
   pip install fastapi uvicorn pandas numpy scikit-learn transformers
   pip install yfinance alpha-vantage-python newsapi-python
   pip install sqlalchemy psycopg2-binary python-jose websockets
   ```

2. **Environment Variables**
   ```
   DATABASE_URL=postgresql://...
   ALPHA_VANTAGE_API_KEY=your_key
   NEWS_API_KEY=your_key
   OPENAI_API_KEY=your_key (optional)
   ```

3. **Start Backend Server**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Project Structure

```
src/
├── components/         # React components
│   ├── auth/          # Authentication components
│   └── dashboard/     # Dashboard components
├── context/           # React context providers
├── types/             # TypeScript type definitions
├── data/              # Mock data and constants
├── utils/             # Utility functions
├── api/               # API integration layer
└── styles/            # Global styles
```

## Security Features

- Input validation and sanitization
- Secure authentication flow
- Protected routes
- Error handling and logging
- Data encryption in transit

## Performance Optimizations

- Lazy loading of components
- Optimized bundle splitting
- Image optimization
- Caching strategies
- Responsive design patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own applications.