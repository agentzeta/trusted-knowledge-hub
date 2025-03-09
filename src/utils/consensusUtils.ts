
import { Response } from '../types/query';

// Helper function to calculate Jaccard similarity between two strings
export const calculateJaccardSimilarity = (str1: string, str2: string): number => {
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
const clusterResponses = (responses: Response[], similarityThreshold: number): Response[][] => {
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

// Extract common information from a cluster of responses
const extractCommonInformation = (cluster: Response[]): string => {
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
  const confidenceScore = (clusterSizeFactor * 0.7) + (avgConfidence * 0.3);
  
  console.log(`Consensus confidence calculation:`);
  console.log(`- Cluster size factor: ${clusterSizeFactor.toFixed(3)} (${cluster.length}/${allResponses.length} responses)`);
  console.log(`- Average confidence: ${avgConfidence.toFixed(3)}`);
  console.log(`- Combined confidence score: ${confidenceScore.toFixed(3)}`);
  
  return confidenceScore;
};

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
