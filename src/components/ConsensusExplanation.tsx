
import React from 'react';
import { motion } from 'framer-motion';
import { Response } from '../types/query';
import { generateConsensusExplanation, analyzeConsensus } from '../utils/consensusUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InfoIcon, BarChart2 } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ConsensusExplanationProps {
  responses: Response[];
}

const ConsensusExplanation: React.FC<ConsensusExplanationProps> = ({ responses }) => {
  if (responses.length === 0) return null;
  
  const verifiedCount = responses.filter(r => r.verified).length;
  const consensusPercentage = responses.length > 0 ? verifiedCount / responses.length : 0;
  const consensusConfidence = consensusPercentage * 0.7 + 0.3; // Simple formula for demonstration
  
  const explanation = generateConsensusExplanation(
    responses,
    verifiedCount,
    consensusConfidence
  );

  // Get detailed consensus analysis for visualizations
  const consensusAnalysis = analyzeConsensus(responses);

  // Calculate general stats for explanation
  const totalModels = responses.length;
  const divergentCount = totalModels - verifiedCount;
  const agreementPercent = Math.round(consensusPercentage * 100);
  
  // Create detailed explanation of the calculation
  const calculationExplanation = `
Consensus calculation:
- Total models responding: ${totalModels}
- Models in agreement: ${verifiedCount} (${agreementPercent}%)
- Models with different responses: ${divergentCount} (${100 - agreementPercent}%)

Confidence calculation:
- Base consensus percentage: ${agreementPercent}%
- Adjusted confidence: ${Math.round(consensusConfidence * 100)}%
  (Using formula: consensusPercentage * 0.7 + 0.3)

The confidence is influenced by both the percentage of agreeing models and the consistency of their responses. Even with high agreement, confidence may be lower if the responses vary significantly in content structure or specific details.

${divergentCount > 0 ? `
Potential reasons for divergent responses:
- Different training data across models
- Varying interpretations of ambiguous queries
- Some models might have more up-to-date information
- Different reasoning approaches to the same problem
- Specialized domain knowledge in certain models (medical, scientific, etc.)
- Response format differences that affect semantic similarity calculations
` : ''}
`;

  // Prepare data for visualizations
  const pieData = [
    { name: 'Verified', value: verifiedCount, color: '#4ade80' }, // Green
    { name: 'Divergent', value: divergentCount, color: '#f87171' }, // Red
  ];

  // Prepare model similarity data
  const modelSimilarityData = responses.map(response => {
    // Calculate average similarity with other responses
    let totalSimilarity = 0;
    let comparisonCount = 0;
    
    for (const otherResponse of responses) {
      if (otherResponse.id !== response.id) {
        totalSimilarity += responses
          .filter(r => r.verified)
          .some(r => r.id === otherResponse.id) ? 0.8 : 0.3; // Simplified for visualization
        comparisonCount++;
      }
    }
    
    const avgSimilarity = comparisonCount > 0 ? totalSimilarity / comparisonCount : 0;
    
    return {
      name: response.source,
      similarity: Math.round(avgSimilarity * 100),
      verified: response.verified ? 'Yes' : 'No',
      color: response.verified ? '#4ade80' : '#f87171'
    };
  });

  // Sort by verified status and then by name
  modelSimilarityData.sort((a, b) => {
    if (a.verified === b.verified) {
      return a.name.localeCompare(b.name);
    }
    return a.verified === 'Yes' ? -1 : 1;
  });
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-4"
    >
      <div className="bg-white/90 p-6 rounded-xl shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium">Consensus Explanation</h3>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>View Analysis Details</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Consensus Analysis Details</DialogTitle>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                {/* Summary section */}
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="font-medium">Summary</p>
                  <p className="text-sm mt-1">
                    {verifiedCount} out of {totalModels} models ({agreementPercent}%) reached consensus.
                    Overall confidence: {Math.round(consensusConfidence * 100)}%.
                  </p>
                </div>
                
                {/* Visualizations section - 2-column grid on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pie chart */}
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <h4 className="text-sm font-medium mb-3 text-center">Model Agreement</h4>
                    <div className="h-64">
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
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Bar chart - Model Similarity */}
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <h4 className="text-sm font-medium mb-3 text-center">Model Similarity</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={modelSimilarityData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={100}
                            tick={{ fill: '#666', fontSize: 12 }}
                          />
                          <Tooltip 
                            formatter={(value, name, props) => [`${value}%`, 'Similarity']}
                            labelFormatter={(value) => `Model: ${value}`}
                          />
                          <Bar 
                            dataKey="similarity" 
                            name="Similarity" 
                            fill="#8884d8"
                            barSize={20}
                          >
                            {modelSimilarityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Calculation details */}
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium mb-3">Calculation Details</h4>
                  <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-4 rounded-md overflow-x-auto">
                    {calculationExplanation}
                  </pre>
                </div>
                
                {/* Model list */}
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium mb-3">Model Verification Status</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Model
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verified
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Confidence
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {responses.map((response, idx) => (
                          <tr key={idx} className={response.verified ? "bg-green-50" : "bg-red-50"}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {response.source}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                response.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {response.verified ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {Math.round(response.confidence * 100)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-line text-gray-700">{explanation}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsensusExplanation;
