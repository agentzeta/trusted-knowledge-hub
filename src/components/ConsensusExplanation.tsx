
import React from 'react';
import { motion } from 'framer-motion';
import { Response } from '../types/query';
import { generateConsensusExplanation } from '../utils/consensusUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';

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
              <Button variant="outline" size="sm">
                View Calculation Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Consensus & Confidence Calculation</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-blue-50 rounded-md">
                  <p className="font-medium">Summary</p>
                  <p className="text-sm mt-1">
                    {verifiedCount} out of {totalModels} models ({agreementPercent}%) reached consensus.
                    Overall confidence: {Math.round(consensusConfidence * 100)}%.
                  </p>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                    {calculationExplanation}
                  </pre>
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
