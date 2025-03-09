
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Response } from '../types/query';
import { generateConsensusExplanation } from '../utils/consensusUtils';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsensusExplanationProps {
  responses: Response[];
}

const ConsensusExplanation: React.FC<ConsensusExplanationProps> = ({ responses }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
      className="w-full max-w-3xl mx-auto mt-4 bg-white/90 dark:bg-slate-900/90 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900/30"
    >
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Consensus Explanation</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-auto"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="font-medium">Summary</p>
                <p className="text-sm mt-1">
                  {verifiedCount} out of {totalModels} models ({agreementPercent}%) reached consensus.
                  Overall confidence: {Math.round(consensusConfidence * 100)}%.
                </p>
              </div>
              
              <div className="mt-4 prose prose-sm max-w-none dark:prose-invert">
                <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{explanation}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Technical Details</h4>
                <pre className="text-xs whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md overflow-auto">
                  {calculationExplanation}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConsensusExplanation;
