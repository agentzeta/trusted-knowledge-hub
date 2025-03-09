
import React from 'react';
import { Response } from '../../types/query';
import { calculateJaccardSimilarity } from '../../utils/consensusUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ModelComparisonChartProps {
  responses: Response[];
}

const ModelComparisonChart: React.FC<ModelComparisonChartProps> = ({ responses }) => {
  if (responses.length === 0) return null;
  
  const similarityData = responses.map((r) => {
    let sum = 0;
    for (const otherResponse of responses) {
      if (otherResponse.id !== r.id) {
        sum += calculateJaccardSimilarity(r.content, otherResponse.content);
      }
    }
    const avgSimilarity = (responses.length > 1) ? sum / (responses.length - 1) : 1;
    
    return {
      name: r.source,
      similarity: Math.round(avgSimilarity * 100),
      confidence: Math.round(r.confidence * 100),
      verified: r.verified
    };
  });
  
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl">
      <h3 className="text-sm font-medium mb-2 text-center">Model Similarity & Confidence</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={similarityData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="similarity" name="Similarity %" fill="#8884d8" />
            <Bar dataKey="confidence" name="Confidence %" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ModelComparisonChart;
