
import React, { useState } from 'react';
import { Response } from '../../types/query';
import { calculateAllModelMetrics, ModelMetrics } from '../../utils/leaderboard/modelMetricsUtils';
import LeaderboardFilter from './LeaderboardFilter';
import LeaderboardTable from './LeaderboardTable';
import AntiHallucinationExplanation from './AntiHallucinationExplanation';
import MetricsExplanation from './MetricsExplanation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ModelAccuracyLeaderboardProps {
  responses: Response[];
  consensusText: string;
}

const ModelAccuracyLeaderboard: React.FC<ModelAccuracyLeaderboardProps> = ({ 
  responses, 
  consensusText 
}) => {
  const [sortMetric, setSortMetric] = useState<keyof ModelMetrics>('accuracyScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [category, setCategory] = useState<string>('all');
  
  // Calculate metrics for all models
  const allMetrics = calculateAllModelMetrics(responses, consensusText);
  
  // Filter metrics by category
  const filteredMetrics = category === 'all' 
    ? allMetrics 
    : allMetrics.filter(metrics => {
        const modelName = metrics.modelName.toLowerCase();
        return modelName.includes(category.toLowerCase());
      });
  
  // Sort metrics by selected metric and direction
  const sortedMetrics = [...filteredMetrics].sort((a, b) => {
    const aValue = a[sortMetric];
    const bValue = b[sortMetric];
    
    return sortDirection === 'asc' 
      ? aValue - bValue 
      : bValue - aValue;
  });
  
  // Handle sort changes
  const handleSortChange = (metric: keyof ModelMetrics) => {
    if (metric === sortMetric) {
      // Toggle direction if same metric
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new metric and default to descending
      setSortMetric(metric);
      setSortDirection('desc');
    }
  };
  
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto mt-6 p-6 rounded-xl glass card-shadow bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <span className="mr-2">🏆</span>
        Model Accuracy Leaderboard
      </h3>
      
      <Tabs defaultValue="leaderboard" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="anti-hallucination">Anti-Hallucination</TabsTrigger>
          <TabsTrigger value="metrics">Metrics Explained</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaderboard" className="px-1 py-4">
          <LeaderboardFilter 
            onCategoryChange={handleCategoryChange} 
            selectedCategory={category} 
          />
          
          <LeaderboardTable 
            metrics={sortedMetrics} 
            sortMetric={sortMetric}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        </TabsContent>
        
        <TabsContent value="anti-hallucination" className="px-1 py-4">
          <AntiHallucinationExplanation />
        </TabsContent>
        
        <TabsContent value="metrics" className="px-1 py-4">
          <MetricsExplanation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelAccuracyLeaderboard;
