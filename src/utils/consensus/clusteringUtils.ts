
import { Response } from '../../types/query';
import { calculateJaccardSimilarity } from './similarityUtils';

// Helper function to determine if a response is an outlier based on similarity threshold
export const isOutlier = (response: Response, responses: Response[], threshold: number): boolean => {
  // Calculate average similarity with other responses
  let totalSimilarity = 0;
  let count = 0;
  
  for (const otherResponse of responses) {
    if (otherResponse.id !== response.id) {
      const similarity = calculateJaccardSimilarity(response.content, otherResponse.content);
      console.log(`Similarity between ${response.source} and ${otherResponse.source}: ${similarity.toFixed(3)}`);
      totalSimilarity += similarity;
      count++;
    }
  }
  
  const avgSimilarity = count > 0 ? totalSimilarity / count : 0;
  console.log(`Average similarity for ${response.source}: ${avgSimilarity.toFixed(3)}, threshold: ${threshold}`);
  return avgSimilarity < threshold;
};

// Helper to group responses into clusters of similar content
export const clusterResponses = (responses: Response[], similarityThreshold: number): Response[][] => {
  if (responses.length === 0) return [];
  
  console.log(`Clustering responses with similarity threshold: ${similarityThreshold}`);
  
  const clusters: Response[][] = [];
  const assigned = new Set<string>();
  
  // For each unassigned response, create a new cluster
  for (let i = 0; i < responses.length; i++) {
    if (assigned.has(responses[i].id)) continue;
    
    const cluster: Response[] = [responses[i]];
    assigned.add(responses[i].id);
    
    console.log(`Creating new cluster with seed response from: ${responses[i].source}`);
    
    // Find all similar responses and add to this cluster
    for (let j = 0; j < responses.length; j++) {
      if (i !== j && !assigned.has(responses[j].id)) {
        const similarity = calculateJaccardSimilarity(
          responses[i].content, 
          responses[j].content
        );
        
        console.log(`Checking ${responses[j].source} for cluster inclusion. Similarity: ${similarity.toFixed(3)}`);
        
        if (similarity >= similarityThreshold) {
          cluster.push(responses[j]);
          assigned.add(responses[j].id);
          console.log(`Added ${responses[j].source} to cluster with ${responses[i].source}`);
        }
      }
    }
    
    clusters.push(cluster);
  }
  
  // Sort clusters by size (largest first)
  clusters.sort((a, b) => b.length - a.length);
  
  console.log(`Created ${clusters.length} clusters:`);
  clusters.forEach((cluster, idx) => {
    console.log(`Cluster ${idx+1} (size: ${cluster.length}): ${cluster.map(r => r.source).join(', ')}`);
  });
  
  return clusters;
};

// Extract common information from a cluster of responses
export const extractCommonInformation = (cluster: Response[]): string => {
  if (cluster.length === 0) return "";
  if (cluster.length === 1) return cluster[0].content;
  
  // Sort by confidence to prioritize high confidence responses
  const sortedByConfidence = [...cluster].sort((a, b) => b.confidence - a.confidence);
  
  console.log(`Extracting consensus from cluster with ${cluster.length} responses`);
  console.log(`Response confidence values: ${cluster.map(r => `${r.source}: ${r.confidence.toFixed(2)}`).join(', ')}`);
  console.log(`Highest confidence response from: ${sortedByConfidence[0].source}`);
  
  // Use the highest confidence response
  // IMPORTANT: This is not biased toward any specific model, but toward the response
  // with highest confidence in the largest cluster of similar responses
  const topResponse = sortedByConfidence[0].content;
  
  return topResponse;
};

// Calculate confidence score for the consensus based on cluster size and confidence
export const calculateConsensusConfidence = (
  cluster: Response[], 
  allResponses: Response[]
): number => {
  if (cluster.length === 0) return 0;
  
  // Factor 1: Proportion of responses in the cluster
  const clusterSizeFactor = cluster.length / allResponses.length;
  
  // Factor 2: Average confidence of responses in the cluster
  const avgConfidence = cluster.reduce((sum, r) => sum + r.confidence, 0) / cluster.length;
  
  // Combined confidence score (simple weighted average)
  const confidenceScore = (clusterSizeFactor * 0.7) + (avgConfidence * 0.3);
  
  console.log(`Consensus confidence calculation:`);
  console.log(`- Cluster size factor: ${clusterSizeFactor.toFixed(3)} (${cluster.length}/${allResponses.length} responses)`);
  console.log(`- Average confidence: ${avgConfidence.toFixed(3)}`);
  console.log(`- Combined confidence score: ${confidenceScore.toFixed(3)}`);
  
  return confidenceScore;
};
