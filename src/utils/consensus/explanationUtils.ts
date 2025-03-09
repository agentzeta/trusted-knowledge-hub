
import { Response } from '../../types/query';
import { calculateJaccardSimilarity } from './similarityUtils';
import { clusterResponses } from './clusteringUtils';

// Generate an explanation of consensus calculation
export const generateConsensusExplanation = (
  allResponses: Response[],
  verifiedCount: number,
  consensusConfidence: number,
  similarityThreshold: number = 0.30
): string => {
  // Get consensus level description
  const consensusPercentage = verifiedCount / allResponses.length * 100;
  let consensusLevel = "";
  if (consensusPercentage >= 80) consensusLevel = "strong";
  else if (consensusPercentage >= 60) consensusLevel = "moderate";
  else if (consensusPercentage >= 40) consensusLevel = "weak";
  else consensusLevel = "very low";
  
  // Calculate average similarity between all responses
  let totalSimilarity = 0;
  let pairCount = 0;
  
  for (let i = 0; i < allResponses.length; i++) {
    for (let j = i + 1; j < allResponses.length; j++) {
      totalSimilarity += calculateJaccardSimilarity(
        allResponses[i].content,
        allResponses[j].content
      );
      pairCount++;
    }
  }
  
  const avgSimilarity = pairCount > 0 ? totalSimilarity / pairCount : 0;
  
  // Get the number of clusters
  const clusters = clusterResponses(allResponses, similarityThreshold);
  
  // Generate explanation
  let explanation = `Consensus Analysis: ${verifiedCount} out of ${allResponses.length} AI responses align with the consensus view (${Math.round(consensusPercentage)}%).\n\n`;
  
  // Explain consensus confidence
  explanation += `Confidence: ${Math.round(consensusConfidence * 100)}% - This reflects both how many models agree and their individual confidence levels.\n\n`;
  
  // Explain agreement patterns
  explanation += `The average text similarity between all responses is ${Math.round(avgSimilarity * 100)}%. `;
  
  // Explain cluster information
  if (clusters.length > 1) {
    explanation += `The responses formed ${clusters.length} distinct clusters of opinion, `;
    explanation += `with the largest cluster containing ${clusters[0].length} responses.\n\n`;
  } else {
    explanation += `All responses formed a single cluster of similar opinions.\n\n`;
  }
  
  // Explain consensus level reasoning
  explanation += `This represents a ${consensusLevel} consensus among the queried AI models. `;
  
  // Explain possible reasons for low consensus when applicable
  if (consensusLevel === "weak" || consensusLevel === "very low") {
    explanation += 'Possible reasons for low consensus include:\n';
    explanation += '- The question may be ambiguous or open to multiple interpretations\n';
    explanation += '- The topic might involve subjective perspectives rather than objective facts\n'; 
    explanation += '- Different AI models may have different training data or knowledge cutoffs\n';
    explanation += '- The query might involve emerging or rapidly evolving topics where information is still developing\n';
    explanation += '- Some models may be more cautious about providing definitive answers on certain topics\n';
    explanation += '- Different models may prioritize different aspects of the same topic\n';
  }
  
  return explanation;
};
