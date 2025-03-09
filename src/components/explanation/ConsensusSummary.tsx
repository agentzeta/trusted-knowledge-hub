
import React from 'react';
import { Response } from '../../types/query';

interface ConsensusSummaryProps {
  responses: Response[];
  consensusPercentage: number;
  consensusConfidence: number;
}

const ConsensusSummary: React.FC<ConsensusSummaryProps> = ({ 
  responses, 
  consensusPercentage, 
  consensusConfidence 
}) => {
  const totalModels = responses.length;
  const verifiedCount = responses.filter(r => r.verified).length;
  const agreementPercent = Math.round(consensusPercentage * 100);
  
  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
      <p className="font-medium">Summary</p>
      <p className="text-sm mt-1">
        {verifiedCount} out of {totalModels} models ({agreementPercent}%) reached consensus.
        Overall confidence: {Math.round(consensusConfidence * 100)}%.
      </p>
    </div>
  );
};

export default ConsensusSummary;
