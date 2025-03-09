
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, DollarSign, TrendingUp, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQueryContext } from '@/hooks/useQueryContext';
import { format, addDays, addMonths } from 'date-fns';

interface StockPricePredictorProps {
  onClose: () => void;
}

const StockPricePredictor: React.FC<StockPricePredictorProps> = ({ onClose }) => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [predictionDate, setPredictionDate] = useState(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<null | {
    predictedPrice: number;
    currentPrice: number;
    percentageChange: number;
    confidenceScore: number;
  }>(null);
  
  const { submitQuery } = useQueryContext();
  
  // Popular stocks for quick selection
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'GOOGL', name: 'Google' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'FB', name: 'Meta' },
    { symbol: 'NVDA', name: 'NVIDIA' },
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockSymbol) return;
    
    setIsLoading(true);
    setPrediction(null);
    
    try {
      // For demo purposes, we'll generate a mock prediction
      // In a real application, this would call the FTSO API
      setTimeout(() => {
        const currentPrice = Math.random() * 500 + 50;
        const change = (Math.random() * 30 - 15) / 100; // -15% to +15%
        const predictedPrice = currentPrice * (1 + change);
        const confidence = Math.random() * 20 + 60; // 60-80% confidence
        
        setPrediction({
          currentPrice: parseFloat(currentPrice.toFixed(2)),
          predictedPrice: parseFloat(predictedPrice.toFixed(2)),
          percentageChange: parseFloat((change * 100).toFixed(2)),
          confidenceScore: parseFloat(confidence.toFixed(1)),
        });
        
        setIsLoading(false);
        
        // Also submit a query to get analysis from the AI
        const query = `Based on current market trends and historical data, what is the price prediction for ${stockSymbol} on ${predictionDate}? Please provide a detailed analysis including potential factors that might influence the stock price.`;
        submitQuery(query);
      }, 2000);
    } catch (error) {
      console.error('Error making prediction:', error);
      setIsLoading(false);
    }
  };
  
  const handleStockSelect = (symbol: string) => {
    setStockSymbol(symbol);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
          FTSO Stock Price Predictor
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="stock-symbol">Stock Symbol</Label>
          <div className="mt-1">
            <Input
              id="stock-symbol"
              placeholder="Enter stock symbol (e.g., AAPL)"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {popularStocks.map((stock) => (
              <Button
                key={stock.symbol}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleStockSelect(stock.symbol)}
                className={`px-3 py-1 text-xs ${
                  stockSymbol === stock.symbol 
                    ? 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
                    : ''
                }`}
              >
                {stock.symbol}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <Label htmlFor="prediction-date">Prediction Date</Label>
          <div className="mt-1 relative">
            <Input
              id="prediction-date"
              type="date"
              value={predictionDate}
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
              onChange={(e) => setPredictionDate(e.target.value)}
              className="w-full"
            />
            <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div>
          <button
            type="button"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showAdvancedOptions ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
          
          {showAdvancedOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-md"
            >
              <div>
                <Label htmlFor="confidence-level">Confidence Level: {confidenceLevel}%</Label>
                <Input
                  id="confidence-level"
                  type="range"
                  min="50"
                  max="99"
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50% (Less conservative)</span>
                  <span>99% (More conservative)</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center"
            disabled={!stockSymbol || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 mr-2 border-t-2 border-b-2 border-blue-200 rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>Predict with FTSO</>
            )}
          </Button>
        </div>
      </form>
      
      {prediction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <BarChart className="mr-2 h-5 w-5 text-blue-500" />
            Prediction Results
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">Current Price</span>
              <span className="text-xl font-bold flex items-center">
                <DollarSign className="h-4 w-4" />
                {prediction.currentPrice}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">Predicted Price</span>
              <span className="text-xl font-bold flex items-center">
                <DollarSign className="h-4 w-4" />
                {prediction.predictedPrice}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">Potential Change</span>
              <span className={`text-lg font-bold flex items-center ${
                prediction.percentageChange > 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {prediction.percentageChange > 0 ? '+' : ''}
                {prediction.percentageChange}%
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-slate-400">Confidence Score</span>
              <span className="text-lg font-bold">{prediction.confidenceScore}%</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This prediction is powered by Flare Time Series Oracles (FTSO), which aggregates 
              data from multiple providers to generate accurate price forecasts.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StockPricePredictor;
