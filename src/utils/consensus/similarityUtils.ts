
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
