
import { Response } from '../types/query';

// Get consensus response from all AI responses
export const deriveConsensusResponse = (allResponses: Response[]): string => {
  // Simple approach: use the most verified response with highest confidence
  if (allResponses.length === 0) return "No responses available";
  
  const sortedResponses = [...allResponses].sort((a, b) => {
    if (a.verified === b.verified) {
      return b.confidence - a.confidence;
    }
    return a.verified ? -1 : 1;
  });
  
  return sortedResponses[0].content;
};
