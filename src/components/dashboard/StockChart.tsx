import React, { useEffect, useRef } from 'react';
import { Stock } from '../../types/stock';

interface StockChartProps {
  stock: Stock;
  timeframe: string;
}

const StockChart: React.FC<StockChartProps> = ({ stock, timeframe }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);

    // Generate mock data based on timeframe
    const dataPoints = getDataPointsForTimeframe(timeframe);
    const data = generateMockPriceData(stock.price, dataPoints, stock.change);

    // Draw chart
    drawChart(ctx, data, chartRef.current.width, chartRef.current.height);
  }, [stock, timeframe]);

  const getDataPointsForTimeframe = (tf: string): number => {
    switch (tf) {
      case '1D': return 24;
      case '1W': return 7;
      case '1M': return 30;
      case '3M': return 90;
      case '1Y': return 365;
      case '5Y': return 1825;
      default: return 30;
    }
  };

  const generateMockPriceData = (basePrice: number, points: number, trend: number) => {
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i < points; i++) {
      const randomChange = (Math.random() - 0.5) * 4;
      const trendInfluence = (trend / points) * i;
      currentPrice = Math.max(0, basePrice + trendInfluence + randomChange * (i / 10));
      data.push(currentPrice);
    }
    
    return data;
  };

  const drawChart = (ctx: CanvasRenderingContext2D, data: number[], width: number, height: number) => {
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const minPrice = Math.min(...data);
    const maxPrice = Math.max(...data);
    const priceRange = maxPrice - minPrice;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw price line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((price, index) => {
      const x = padding + (chartWidth * index / (data.length - 1));
      const y = padding + (chartHeight * (1 - (price - minPrice) / priceRange));
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Fill area under curve
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw price labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange * (5 - i) / 5);
      const y = padding + (chartHeight * i / 5);
      ctx.fillText(`$${price.toFixed(2)}`, padding - 10, y + 4);
    }
  };

  return (
    <div>
      <canvas
        ref={chartRef}
        width={800}
        height={400}
        className="w-full h-auto"
      />
    </div>
  );
};

export default StockChart;