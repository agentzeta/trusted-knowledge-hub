
import React from 'react';

const AntiHallucinationExplanation: React.FC = () => {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <h4>How We Detect & Prevent AI Hallucinations</h4>
      
      <p>
        <strong>What are hallucinations?</strong> AI hallucinations occur when models generate information that seems plausible but is factually incorrect, 
        contradictory, or entirely fabricated. Our system uses multiple techniques to identify and mitigate these issues:
      </p>
      
      <h5 className="mt-4">Our Anti-Hallucination Measures:</h5>
      
      <ol className="space-y-2">
        <li>
          <strong>Multi-Model Consensus:</strong> By comparing responses from multiple independent AI models, 
          we identify when a specific model's response deviates significantly from the others, flagging potential hallucinations.
        </li>
        
        <li>
          <strong>Factual Consistency Detection:</strong> We analyze responses for internal consistency patterns that 
          typically indicate factually reliable information.
        </li>
        
        <li>
          <strong>Outlier Detection:</strong> Statistical methods help us identify responses that are significant 
          outliers compared to the consensus viewpoint.
        </li>
        
        <li>
          <strong>Contradiction Analysis:</strong> We look for logical contradictions within the same model's 
          responses over time and between different models.
        </li>
        
        <li>
          <strong>Confidence Calibration:</strong> Each model's confidence score is calibrated based on its 
          historical accuracy and agreement with verified information.
        </li>
      </ol>
      
      <p className="mt-4">
        <strong>The Benefit of Consensus:</strong> By combining these techniques and leveraging multiple independent 
        AI systems, we dramatically reduce hallucination risks. When models independently arrive at similar conclusions, 
        the reliability of that information is significantly higher.
      </p>
      
      <p className="mt-4 text-sm text-blue-600 dark:text-blue-400">
        Our leaderboard tracks each model's hallucination rate over time, incentivizing ongoing improvements in AI factual reliability.
      </p>
    </div>
  );
};

export default AntiHallucinationExplanation;
