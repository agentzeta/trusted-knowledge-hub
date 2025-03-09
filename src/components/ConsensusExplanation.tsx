
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Response } from '../types/query';
import { generateConsensusExplanation } from '../utils/consensusUtils';
import ExplanationHeader from './explanation/ExplanationHeader';
import ExplanationContent from './explanation/ExplanationContent';

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

  const toggleExpanded = () => setIsExpanded(!isExpanded);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-4 bg-white/90 dark:bg-slate-900/90 p-6 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900/30"
    >
      <ExplanationHeader 
        isExpanded={isExpanded} 
        toggleExpand={toggleExpanded}
        title="Consensus Explanation"
      />
      
      <ExplanationContent 
        isExpanded={isExpanded}
        responses={responses}
        explanation={explanation}
        calculationExplanation={calculationExplanation}
        consensusPercentage={consensusPercentage}
        consensusConfidence={consensusConfidence}
      />
    </motion.div>
  );
};

export default ConsensusExplanation;
