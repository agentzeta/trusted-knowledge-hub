
import { Response } from '../../types/query';
import { calculateJaccardSimilarity } from './similarityUtils';

// New function to verify responses based on consensus
export const verifyResponses = (
  responses: Response[], 
  consensusText: string,
  verificationThreshold: number = 0.45
): Response[] => {
  console.log(`Verifying ${responses.length} responses against consensus with threshold: ${verificationThreshold}`);
  
  // Track similarities for all responses before determining verification status
  const similarities = responses.map(response => {
    const similarity = calculateJaccardSimilarity(response.content, consensusText);
    console.log(`${response.source} similarity to consensus: ${similarity.toFixed(3)}`);
    return { response, similarity };
  });
  
  // Calculate mean and standard deviation to detect and prevent bias
  const mean = similarities.reduce((sum, item) => sum + item.similarity, 0) / similarities.length;
  const stdDev = Math.sqrt(
    similarities.reduce((sum, item) => sum + Math.pow(item.similarity - mean, 2), 0) / similarities.length
  );
  
  console.log(`Similarity statistics - Mean: ${mean.toFixed(3)}, StdDev: ${stdDev.toFixed(3)}`);
  
  // Adjust threshold if there's high variance to prevent bias toward any specific model format
  // This prevents models with similar output format from being unfairly advantaged
  const adjustedThreshold = stdDev > 0.2 
    ? Math.max(0.4, mean - (0.5 * stdDev)) // More inclusive when there's high variance
    : verificationThreshold;
  
  console.log(`Adjusted verification threshold: ${adjustedThreshold.toFixed(3)}`);
  
  // Apply verification with the adjusted threshold
  return responses.map(response => {
    const similarity = calculateJaccardSimilarity(response.content, consensusText);
    const isVerified = similarity >= adjustedThreshold;
    
    console.log(`${response.source} verified: ${isVerified} (similarity: ${similarity.toFixed(3)})`);
    
    return {
      ...response,
      verified: isVerified
    };
  });
};
