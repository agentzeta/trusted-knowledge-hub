
import React from 'react';
import { ModelMetrics } from '../../utils/leaderboard/modelMetricsUtils';
import { ArrowUpDown, Trophy, AlertCircle, Check, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeaderboardTableProps {
  metrics: ModelMetrics[];
  sortMetric: keyof ModelMetrics;
  sortDirection: 'asc' | 'desc';
  onSortChange: (metric: keyof ModelMetrics) => void;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  metrics,
  sortMetric,
  sortDirection,
  onSortChange
}) => {
  // Metrics to display in the table
  const displayMetrics: {key: keyof ModelMetrics, label: string, icon: React.ReactNode}[] = [
    { key: 'accuracyScore', label: 'Accuracy', icon: <Trophy size={16} /> },
    { key: 'hallucinationRate', label: 'Hallucination', icon: <AlertCircle size={16} /> },
    { key: 'consensusAgreement', label: 'Consensus', icon: <Check size={16} /> },
    { key: 'contradictionRate', label: 'Contradiction', icon: <Shuffle size={16} /> }
  ];
  
  const formatPercent = (value: number | string): string => {
    // Ensure we have a number to format
    const numValue = typeof value === 'number' ? value : 0;
    return `${Math.round(numValue * 100)}%`;
  };
  
  const getColorClass = (metric: keyof ModelMetrics, value: number): string => {
    // Determine color based on metric type and value
    if (metric === 'hallucinationRate' || metric === 'contradictionRate') {
      // For these metrics, lower is better
      return value < 0.3 ? "text-green-600" : value > 0.6 ? "text-red-500" : "text-amber-500";
    } else {
      // For other metrics, higher is better
      return value > 0.7 ? "text-green-600" : value < 0.4 ? "text-red-500" : "text-amber-500";
    }
  };
  
  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2">Rank</th>
            <th className="text-left p-2">Model</th>
            {displayMetrics.map(metric => (
              <th key={metric.key} className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    sortMetric === metric.key && "text-primary"
                  )}
                  onClick={() => onSortChange(metric.key)}
                >
                  <span className="flex items-center gap-1">
                    {metric.icon}
                    {metric.label}
                  </span>
                  <ArrowUpDown size={14} />
                </Button>
              </th>
            ))}
            <th className="text-center p-2">Responses</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr 
              key={metric.modelName} 
              className={cn(
                "border-t border-gray-100 dark:border-gray-800",
                index % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-800/30" : ""
              )}
            >
              <td className="p-2 font-medium">
                {index === 0 && <span className="text-yellow-500">🥇</span>}
                {index === 1 && <span className="text-gray-400">🥈</span>}
                {index === 2 && <span className="text-amber-700">🥉</span>}
                {index > 2 && index + 1}
              </td>
              <td className="p-2">{metric.modelName}</td>
              {displayMetrics.map(dm => {
                // Get the metric value and ensure it's a number
                const metricValue = typeof metric[dm.key] === 'number' 
                  ? metric[dm.key] as number
                  : 0;
                
                return (
                  <td 
                    key={dm.key} 
                    className={cn(
                      "p-2 text-center",
                      // Highlight the sorting column
                      sortMetric === dm.key && "font-medium",
                      // Color based on metric type and value
                      getColorClass(dm.key, metricValue)
                    )}
                  >
                    {formatPercent(metricValue)}
                  </td>
                );
              })}
              <td className="p-2 text-center text-sm">
                {metric.verifiedResponses}/{metric.totalResponses}
              </td>
            </tr>
          ))}
          {metrics.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                No models with enough data to display metrics
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
