
import React from 'react';
import { Response } from '../../types/query';
import { calculateAverageSimilarity } from '../../utils/consensusUtils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ConsensusScorecardProps {
  responses: Response[];
}

const ConsensusScorecard: React.FC<ConsensusScorecardProps> = ({ responses }) => {
  if (responses.length === 0) return null;
  
  const verifiedCount = responses.filter(r => r.verified).length;
  const averageSimilarity = calculateAverageSimilarity(responses);
  const confidenceScore = (verifiedCount / responses.length) * averageSimilarity;
  
  const pieData = [
    { name: 'Verified', value: verifiedCount, color: '#4ade80' },
    { name: 'Not Verified', value: responses.length - verifiedCount, color: '#f87171' },
  ];
  
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl">
      <h3 className="text-sm font-medium mb-2 text-center">Consensus Score</h3>
      <div className="flex justify-center items-center h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-sm mt-2">
        <div className="font-medium">Overall Confidence Score: {Math.round(confidenceScore * 100)}%</div>
        <div className="text-gray-500">Based on verification and similarity measures</div>
      </div>
    </div>
  );
};

export default ConsensusScorecard;
