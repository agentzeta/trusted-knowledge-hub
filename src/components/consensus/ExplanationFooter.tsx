
import React from 'react';

const ExplanationFooter: React.FC = () => {
  return (
    <div className="mt-6 text-sm text-gray-500">
      <p><strong>Jaccard Similarity:</strong> Measures text overlap between models (0-100%)</p>
      <p><strong>Confidence Score:</strong> Combined measure of model agreement and confidence</p>
      <p><strong>Verification:</strong> Whether a response aligns with the consensus view</p>
    </div>
  );
};

export default ExplanationFooter;
