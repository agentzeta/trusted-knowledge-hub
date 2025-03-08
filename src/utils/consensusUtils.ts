
import { Response } from '../types/query';

// Helper function to calculate Jaccard similarity between two strings
const calculateJaccardSimilarity = (str1: string, str2: string): number => {
  // Convert to lowercase and split into words
  const words1 = new Set(str1.toLowerCase().split(/\s+/).filter(word => word.length > 3));
  const words2 = new Set(str2.toLowerCase().split(/\s+/).filter(word => word.length > 3));
  
  // Calculate intersection and union
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  // Return Jaccard similarity
  return union.size > 0 ? intersection.size / union.size : 0;
};

// Helper function to determine if a response is an outlier based on similarity threshold
const isOutlier = (response: Response, responses: Response[], threshold: number): boolean => {
  // Calculate average similarity with other responses
  let totalSimilarity = 0;
  let count = 0;
  
  for (const otherResponse of responses) {
    if (otherResponse.id !== response.id) {
      totalSimilarity += calculateJaccardSimilarity(response.content, otherResponse.content);
      count++;
    }
  }
  
  const avgSimilarity = count > 0 ? totalSimilarity / count : 0;
  return avgSimilarity < threshold;
};

// Helper to group responses into clusters of similar content
const clusterResponses = (responses: Response[], similarityThreshold: number): Response[][] => {
  if (responses.length === 0) return [];
  
  const clusters: Response[][] = [];
  const assigned = new Set<string>();
  
  // For each unassigned response, create a new cluster
  for (let i = 0; i < responses.length; i++) {
    if (assigned.has(responses[i].id)) continue;
    
    const cluster: Response[] = [responses[i]];
    assigned.add(responses[i].id);
    
    // Find all similar responses and add to this cluster
    for (let j = 0; j < responses.length; j++) {
      if (i !== j && !assigned.has(responses[j].id)) {
        const similarity = calculateJaccardSimilarity(
          responses[i].content, 
          responses[j].content
        );
        
        if (similarity >= similarityThreshold) {
          cluster.push(responses[j]);
          assigned.add(responses[j].id);
        }
      }
    }
    
    clusters.push(cluster);
  }
  
  return clusters;
};

// Extract common information from a cluster of responses
const extractCommonInformation = (cluster: Response[]): string => {
  if (cluster.length === 0) return "";
  if (cluster.length === 1) return cluster[0].content;
  
  // Sort by confidence to prioritize high confidence responses
  const sortedByConfidence = [...cluster].sort((a, b) => b.confidence - a.confidence);
  const topResponse = sortedByConfidence[0].content;
  
  // For more sophisticated approaches, we could implement:
  // 1. Sentence-level analysis to find common sentences
  // 2. NLP-based extractive summarization
  // 3. Key point extraction and comparison
  
  // For now, we'll use the highest confidence response from the largest cluster
  return topResponse;
};

// Calculate confidence score for the consensus based on cluster size and confidence
const calculateConsensusConfidence = (
  cluster: Response[], 
  allResponses: Response[]
): number => {
  if (cluster.length === 0) return 0;
  
  // Factor 1: Proportion of responses in the cluster
  const clusterSizeFactor = cluster.length / allResponses.length;
  
  // Factor 2: Average confidence of responses in the cluster
  const avgConfidence = cluster.reduce((sum, r) => sum + r.confidence, 0) / cluster.length;
  
  // Combined confidence score (simple weighted average)
  return (clusterSizeFactor * 0.7) + (avgConfidence * 0.3);
};

// New function to verify responses based on consensus
export const verifyResponses = (
  responses: Response[], 
  consensusText: string,
  verificationThreshold: number = 0.6
): Response[] => {
  return responses.map(response => {
    // Calculate similarity with consensus
    const similarity = calculateJaccardSimilarity(response.content, consensusText);
    
    // Determine verification status based on similarity and confidence
    const isVerified = similarity >= verificationThreshold;
    
    // Return a new object with updated verification status
    return {
      ...response,
      verified: isVerified
    };
  });
};

// Get consensus response from all AI responses with enhanced logic
export const deriveConsensusResponse = (allResponses: Response[]): string => {
  if (allResponses.length === 0) return "No responses available";
  if (allResponses.length === 1) return allResponses[0].content;
  
  // Step 1: Filter out clear outliers based on similarity
  const outlierThreshold = 0.15; // Responses with less than 15% average similarity are outliers
  const nonOutliers = allResponses.filter(r => !isOutlier(r, allResponses, outlierThreshold));
  
  if (nonOutliers.length === 0) {
    // If all were outliers, fall back to the highest confidence response
    const sortedByConfidence = [...allResponses].sort((a, b) => b.confidence - a.confidence);
    return sortedByConfidence[0].content + "\n\n(Note: There was significant disagreement between AI responses on this query.)";
  }
  
  // Step 2: Cluster similar responses
  const similarityThreshold = 0.35; // Responses need 35% similarity to be in the same cluster
  const clusters = clusterResponses(nonOutliers, similarityThreshold);
  
  // Step 3: Find the largest cluster (majority opinion)
  const sortedClusters = clusters.sort((a, b) => b.length - a.length);
  const largestCluster = sortedClusters[0];
  
  // Step 4: Extract common information from the largest cluster
  const consensusContent = extractCommonInformation(largestCluster);
  
  // Step 5: Calculate confidence in this consensus
  const consensusConfidence = calculateConsensusConfidence(largestCluster, allResponses);
  const confidenceLevel = consensusConfidence >= 0.8 ? "High" : 
                          consensusConfidence >= 0.5 ? "Moderate" : "Low";
  
  // Add confidence information to the response
  return `${consensusContent}

Consensus Confidence: ${confidenceLevel} (${Math.round(consensusConfidence * 100)}%)
${largestCluster.length} out of ${allResponses.length} AI responses agreed on this answer.

Disclaimer: This AI-generated consensus is for informational purposes only and not a substitute for professional advice, especially for medical, legal, or other specialized domains.`;
};

// This function returns a more detailed analysis that could be used for visualizing the consensus
export const analyzeConsensus = (allResponses: Response[]) => {
  if (allResponses.length === 0) return { confidence: 0, agreementRate: 0, clusters: [] };
  
  // Cluster the responses
  const similarityThreshold = 0.35;
  const clusters = clusterResponses(allResponses, similarityThreshold);
  
  // Sort clusters by size (largest first)
  const sortedClusters = clusters.sort((a, b) => b.length - a.length);
  const largestCluster = sortedClusters[0];
  
  // Calculate confidence
  const consensusConfidence = calculateConsensusConfidence(largestCluster, allResponses);
  
  return {
    confidence: consensusConfidence,
    agreementRate: largestCluster.length / allResponses.length,
    clusters: sortedClusters.map(cluster => ({
      size: cluster.length,
      sources: cluster.map(r => r.source),
      confidence: cluster.reduce((sum, r) => sum + r.confidence, 0) / cluster.length
    }))
  };
};
