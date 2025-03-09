
import React from 'react';

interface TechnicalDetailsProps {
  calculationExplanation: string;
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ calculationExplanation }) => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Technical Details</h4>
      <pre className="text-xs whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md overflow-auto">
        {calculationExplanation}
      </pre>
    </div>
  );
};

export default TechnicalDetails;
