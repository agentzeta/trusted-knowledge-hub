
import { Response } from '../../types/query';
import { clusterResponses } from './clusteringUtils';
import { calculateConsensusConfidence } from './clusteringUtils';
import { calculateJaccardSimilarity } from './similarityUtils';

// This function returns a more detailed analysis that could be used for visualizing the consensus
export const analyzeConsensus = (allResponses: Response[]) => {
  if (allResponses.length === 0) return { confidence: 0, agreementRate: 0, clusters: [] };
  
  // Cluster the responses
  const similarityThreshold = 0.30; // Properly balanced threshold
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

// Helper function to calculate average similarity between all responses
export const calculateAverageSimilarity = (responses: Response[]): number => {
  if (responses.length <= 1) return 1;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const similarity = calculateJaccardSimilarity(
        responses[i].content, 
        responses[j].content
      );
      totalSimilarity += similarity;
      comparisons++;
    }
  }
  
  return comparisons > 0 ? totalSimilarity / comparisons : 0;
};
