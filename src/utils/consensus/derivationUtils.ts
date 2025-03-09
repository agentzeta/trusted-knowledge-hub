
import { Response } from '../../types/query';
import { isOutlier, clusterResponses, extractCommonInformation, calculateConsensusConfidence } from './clusteringUtils';

/**
 * Plain English Explanation of Consensus Logic:
 * 
 * 1. We collect responses from multiple AI models
 * 2. For each response, we calculate how similar it is to all other responses
 * 3. We filter out "outliers" - responses that are too different from most others
 * 4. We group the non-outlier responses into "clusters" of similar content
 * 5. The largest cluster is considered the majority opinion
 * 6. We select the response with highest confidence from this cluster
 * 7. We then verify each response against this consensus (mark as "verified" if similar enough)
 * 
 * Key factors that influence the consensus:
 * - We use word-based Jaccard similarity (shared words / total unique words)
 * - We have thresholds that determine what counts as "similar enough"
 * - We consider both the number of models that agree and their confidence levels
 * - We have bias-prevention mechanisms to avoid favoring any specific model
 */

// Get consensus response from all AI responses with enhanced logic to prevent bias
export const deriveConsensusResponse = (allResponses: Response[]): string => {
  if (allResponses.length === 0) return "No responses available";
  if (allResponses.length === 1) return allResponses[0].content;
  
  console.log(`=== DERIVING CONSENSUS FROM ${allResponses.length} RESPONSES ===`);
  
  // Step 1: Filter out clear outliers based on similarity
  // This prevents isolated, highly different responses from influencing the consensus
  const outlierThreshold = 0.12; // Lowered from 0.15 to be more inclusive
  const nonOutliers = allResponses.filter(r => !isOutlier(r, allResponses, outlierThreshold));
  
  console.log(`After outlier filtering: ${nonOutliers.length} responses remaining`);
  
  // If all were outliers, fall back to the highest confidence response
  if (nonOutliers.length === 0) {
    // Sort all responses by confidence to avoid bias toward any specific model
    const sortedByConfidence = [...allResponses].sort((a, b) => b.confidence - a.confidence);
    console.log(`All responses were outliers. Using highest confidence response from: ${sortedByConfidence[0].source}`);
    return sortedByConfidence[0].content + "\n\n(Note: There was significant disagreement between AI responses on this query.)";
  }
  
  // Step 2: Cluster similar responses - this groups responses with similar content
  // regardless of which model they came from
  const similarityThreshold = 0.30; // Properly balanced threshold
  const clusters = clusterResponses(nonOutliers, similarityThreshold);
  
  // Step 3: Find the largest cluster (majority opinion)
  // This represents the most common viewpoint across different models
  const sortedClusters = clusters.sort((a, b) => b.length - a.length);
  const largestCluster = sortedClusters[0];
  
  console.log(`Largest cluster size: ${largestCluster.length} responses`);
  console.log(`Largest cluster sources: ${largestCluster.map(r => r.source).join(', ')}`);
  
  // Step 4: Extract consensus from the largest cluster
  // We use the response with highest confidence from the largest cluster
  const consensusContent = extractCommonInformation(largestCluster);
  
  // Step 5: Calculate confidence in this consensus
  const consensusConfidence = calculateConsensusConfidence(largestCluster, allResponses);
  const confidenceLevel = consensusConfidence >= 0.8 ? "High" : 
                          consensusConfidence >= 0.5 ? "Moderate" : "Low";
  
  console.log(`Consensus confidence: ${confidenceLevel} (${Math.round(consensusConfidence * 100)}%)`);
  
  // Add confidence information to the response
  return `${consensusContent}

Consensus Confidence: ${confidenceLevel} (${Math.round(consensusConfidence * 100)}%)
${largestCluster.length} out of ${allResponses.length} AI responses agreed on this answer.

Disclaimer: This AI-generated consensus is for informational purposes only and not a substitute for professional advice, especially for medical, legal, or other specialized domains.`;
};
