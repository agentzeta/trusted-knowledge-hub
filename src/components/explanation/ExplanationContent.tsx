
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Response } from '../../types/query';
import ConsensusSummary from './ConsensusSummary';
import ExplanationDetails from './ExplanationDetails';
import TechnicalDetails from './TechnicalDetails';

interface ExplanationContentProps {
  isExpanded: boolean;
  responses: Response[];
  explanation: string;
  calculationExplanation: string;
  consensusPercentage: number;
  consensusConfidence: number;
}

const ExplanationContent: React.FC<ExplanationContentProps> = ({ 
  isExpanded,
  responses,
  explanation,
  calculationExplanation,
  consensusPercentage,
  consensusConfidence
}) => {
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="mt-4">
            <ConsensusSummary 
              responses={responses} 
              consensusPercentage={consensusPercentage} 
              consensusConfidence={consensusConfidence} 
            />
            
            <ExplanationDetails explanation={explanation} />
            
            <TechnicalDetails calculationExplanation={calculationExplanation} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExplanationContent;
