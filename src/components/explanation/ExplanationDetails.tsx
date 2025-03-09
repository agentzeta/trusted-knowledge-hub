
import React from 'react';

interface ExplanationDetailsProps {
  explanation: string;
}

const ExplanationDetails: React.FC<ExplanationDetailsProps> = ({ explanation }) => {
  return (
    <div className="mt-4 prose prose-sm max-w-none dark:prose-invert">
      <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">{explanation}</p>
    </div>
  );
};

export default ExplanationDetails;
