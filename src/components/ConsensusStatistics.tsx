
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Response } from '../types/query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';
import { calculateJaccardSimilarity } from '../utils/consensusUtils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ConsensusStatisticsProps {
  responses: Response[];
}

// Helper function to calculate the average similarity between responses
const calculateAverageSimilarity = (responses: Response[]): number => {
  if (responses.length <= 1) return 1;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const similarity = calculateJaccardSimilarity(
        responses[i].content, 
        responses[j].content
      );
      totalSimilarity += similarity;
      comparisons++;
    }
  }
  
  return comparisons > 0 ? totalSimilarity / comparisons : 0;
};

const ConsensusStatistics: React.FC<ConsensusStatisticsProps> = ({ responses }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (responses.length === 0) return null;
  
  const verifiedCount = responses.filter(r => r.verified).length;
  const averageSimilarity = calculateAverageSimilarity(responses);
  const confidenceScore = (verifiedCount / responses.length) * averageSimilarity;
  
  const pieData = [
    { name: 'Verified', value: verifiedCount, color: '#4ade80' },
    { name: 'Not Verified', value: responses.length - verifiedCount, color: '#f87171' },
  ];
  
  const similarityData = responses.map((r, index) => {
    // Calculate average similarity with other responses
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 mx-auto mt-4"
          onClick={() => setIsOpen(true)}
        >
          <BarChart2 className="h-4 w-4" />
          <span>See Consensus Statistics</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Consensus Analysis</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          <div className="bg-white/50 p-4 rounded-xl">
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
          
          <div className="bg-white/50 p-4 rounded-xl">
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
        </div>
        
        <div className="bg-white/50 p-4 rounded-xl">
          <h3 className="text-sm font-medium mb-2">Jaccard Similarity Matrix</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 bg-gray-100">Model</th>
                  {responses.map((r, i) => (
                    <th key={i} className="border border-gray-300 px-4 py-2 bg-gray-100">{r.source}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((r1, i) => (
                  <tr key={i}>
                    <td className="border border-gray-300 px-4 py-2 font-medium">{r1.source}</td>
                    {responses.map((r2, j) => {
                      const similarity = r1.id === r2.id 
                        ? 1 
                        : calculateJaccardSimilarity(r1.content, r2.content);
                      
                      // Color scale from red (0) to green (1)
                      const colorValue = Math.round(similarity * 255);
                      const bgColor = similarity === 1
                        ? 'bg-gray-100'
                        : `rgb(${255 - colorValue}, ${colorValue}, 100)`;
                      
                      return (
                        <td 
                          key={j} 
                          className={`border border-gray-300 px-4 py-2 text-center ${bgColor}`}
                        >
                          {(similarity * 100).toFixed(0)}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p><strong>Jaccard Similarity:</strong> Measures text overlap between models (0-100%)</p>
          <p><strong>Confidence Score:</strong> Combined measure of model agreement and confidence</p>
          <p><strong>Verification:</strong> Whether a response aligns with the consensus view</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsensusStatistics;
